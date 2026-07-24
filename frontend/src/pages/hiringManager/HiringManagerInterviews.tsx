import { useEffect, useState } from "react";

import {
  getHiringManagerInterviews,
} from "../../services/hiringManagerInterviewService";

import type {
  HiringManagerInterview,
} from "../../types/hiringManager";

export default function HiringManagerInterviews() {
  const [interviews, setInterviews] = useState<
    HiringManagerInterview[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInterviews() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getHiringManagerInterviews();

        if (isMounted) {
          setInterviews(data);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load interviews.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInterviews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Loading interviews...
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            Interviews could not be loaded
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {errorMessage}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Hiring Manager Workspace
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-950">
          Interviews
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review scheduled, completed, cancelled and
          rescheduled interviews.
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No interviews available
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Interview information will appear here when it
            becomes available from the backend.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Candidate
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Job
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Mode
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {interview.candidateName}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {interview.jobTitle}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {interview.scheduledDate}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {interview.mode}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {interview.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}