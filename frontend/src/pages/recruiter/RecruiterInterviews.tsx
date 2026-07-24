import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import InterviewForm from "../../components/interviews/InterviewForm";
import { getInterviewsForApplication } from "../../services/interviewService";
import type { InterviewResponse } from "../../types/interview";

type BackendErrorResponse = {
  message?: string;
};

function formatScheduledAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

function getOptionalDisplayValue(
  value: string | null | undefined,
): string {
  return value?.trim() ?? "";
}

function getSafeMeetingLink(
  value: string | null | undefined,
): string | null {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedValue);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

function mergeInterviews(
  currentInterviews: InterviewResponse[],
  loadedInterviews: InterviewResponse[],
  applicationId: number,
): InterviewResponse[] {
  const seenIds = new Set<number>();

  return [...currentInterviews, ...loadedInterviews].filter(
    (interview) => {
      if (
        interview.jobApplicationId !== applicationId ||
        seenIds.has(interview.id)
      ) {
        return false;
      }

      seenIds.add(interview.id);
      return true;
    },
  );
}

export default function RecruiterInterviews() {
  const [searchParams] = useSearchParams();
  const applicationIdValue = searchParams.get("applicationId");
  const applicationId = useMemo(() => {
    if (!applicationIdValue) {
      return null;
    }

    const parsedApplicationId = Number(applicationIdValue);

    if (
      !Number.isFinite(parsedApplicationId) ||
      !Number.isInteger(parsedApplicationId) ||
      !Number.isSafeInteger(parsedApplicationId) ||
      parsedApplicationId <= 0
    ) {
      return null;
    }

    return parsedApplicationId;
  }, [applicationIdValue]);

  const [interviews, setInterviews] = useState<InterviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeApplicationIdRef = useRef<number | null>(applicationId);

  activeApplicationIdRef.current = applicationId;

  useEffect(() => {
    let isActive = true;

    if (applicationId === null) {
      setInterviews([]);
      setError("");
      setLoading(false);

      return () => {
        isActive = false;
      };
    }

    setInterviews([]);
    setError("");
    setLoading(true);

    const loadInterviews = async () => {
      try {
        const loadedInterviews =
          await getInterviewsForApplication(applicationId);

        if (isActive) {
          setInterviews((currentInterviews) =>
            mergeInterviews(
              currentInterviews,
              loadedInterviews,
              applicationId,
            ),
          );
        }
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        if (axios.isAxiosError<BackendErrorResponse>(loadError)) {
          setError(
            loadError.response?.data?.message?.trim() ||
              "Unable to load interviews. Please try again.",
          );
        } else {
          setError(
            "Unable to load interviews. Please try again.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadInterviews();

    return () => {
      isActive = false;
    };
  }, [applicationId]);

  const handleCreated = (createdInterview: InterviewResponse) => {
    const activeApplicationId = activeApplicationIdRef.current;

    if (
      activeApplicationId === null ||
      createdInterview.jobApplicationId !== activeApplicationId
    ) {
      return;
    }

    setError("");
    setInterviews((currentInterviews) =>
      mergeInterviews(
        [createdInterview],
        currentInterviews,
        activeApplicationId,
      ),
    );
  };

  return (
    <main className="min-h-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Interview Scheduling
          </h1>
          <p className="mt-2 text-slate-600">
            Manage interviews for the selected job application.
          </p>
          <p className="mt-3 text-sm font-medium text-slate-700">
            Application ID:{" "}
            <span className="text-blue-700">
              {applicationId ?? "Not selected"}
            </span>
          </p>
        </header>

        {applicationId === null ? (
          <section
            className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800"
            role="alert"
          >
            Select a valid job application before scheduling an
            interview.
          </section>
        ) : (
          <>
            <section aria-labelledby="schedule-interview-heading">
              <h2
                className="mb-4 text-xl font-semibold text-slate-900"
                id="schedule-interview-heading"
              >
                Schedule Interview
              </h2>
              <InterviewForm
                jobApplicationId={applicationId}
                onCreated={handleCreated}
              />
            </section>

            <section
              className="rounded-xl bg-white p-6 shadow-sm"
              aria-labelledby="scheduled-interviews-heading"
            >
              <h2
                className="text-xl font-semibold text-slate-900"
                id="scheduled-interviews-heading"
              >
                Scheduled Interviews
              </h2>

              {loading && (
                <p
                  className="mt-4 text-sm text-slate-600"
                  role="status"
                >
                  Loading interviews...
                </p>
              )}

              {!loading && error && (
                <p
                  className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {!loading && !error && interviews.length === 0 && (
                <p className="mt-4 text-sm text-slate-600">
                  No interviews have been scheduled for this
                  application.
                </p>
              )}

              {!loading && !error && interviews.length > 0 && (
                <div className="mt-5 space-y-4">
                  {interviews.map((interview) => {
                    const meetingLinkValue =
                      getOptionalDisplayValue(
                        interview.meetingLink,
                      );
                    const safeMeetingLink =
                      getSafeMeetingLink(interview.meetingLink);
                    const locationValue =
                      getOptionalDisplayValue(interview.location);
                    const notesValue =
                      getOptionalDisplayValue(interview.notes);

                    return (
                      <article
                        className="rounded-lg border border-slate-200 p-5"
                        key={interview.id}
                      >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {interview.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-700">
                            {interview.candidateName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {interview.candidateEmail}
                          </p>
                        </div>
                        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {interview.status}
                        </span>
                      </div>

                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-slate-500">
                            Job
                          </dt>
                          <dd className="mt-1 text-slate-800">
                            {interview.jobTitle}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-500">
                            Date and time
                          </dt>
                          <dd className="mt-1 text-slate-800">
                            {formatScheduledAt(
                              interview.scheduledAt,
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-500">
                            Duration
                          </dt>
                          <dd className="mt-1 text-slate-800">
                            {interview.durationMinutes} minutes
                          </dd>
                        </div>

                        {locationValue && (
                          <div>
                            <dt className="font-medium text-slate-500">
                              Location
                            </dt>
                            <dd className="mt-1 text-slate-800">
                              {locationValue}
                            </dd>
                          </div>
                        )}

                        {meetingLinkValue && (
                          <div>
                            <dt className="font-medium text-slate-500">
                              Meeting link
                            </dt>
                            <dd className="mt-1">
                              {safeMeetingLink ? (
                                <a
                                  className="break-all text-blue-700 underline hover:text-blue-800"
                                  href={safeMeetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {meetingLinkValue}
                                </a>
                              ) : (
                                <span className="text-red-600">
                                  Invalid meeting link
                                </span>
                              )}
                            </dd>
                          </div>
                        )}
                      </dl>

                      {notesValue && (
                        <div className="mt-4 border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-slate-500">
                            Notes
                          </h4>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                            {notesValue}
                          </p>
                        </div>
                      )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
