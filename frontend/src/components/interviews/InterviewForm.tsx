import {
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import axios from "axios";

import { createInterview } from "../../services/interviewService";
import type {
  CreateInterviewRequest,
  InterviewResponse,
} from "../../types/interview";

interface InterviewFormProps {
  jobApplicationId: number;
  onCreated: (interview: InterviewResponse) => void;
}

type FormErrors = {
  jobApplicationId?: string;
  title?: string;
  scheduledAt?: string;
  durationMinutes?: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
};

type BackendErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

type MessageType = "success" | "error" | null;

export default function InterviewForm({
  jobApplicationId,
  onCreated,
}: InterviewFormProps) {
  const [title, setTitle] = useState("Interview");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [meetingLink, setMeetingLink] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<MessageType>(null);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const formId = useId();
  const titleId = `${formId}-title`;
  const titleErrorId = `${titleId}-error`;
  const scheduledAtId = `${formId}-scheduled-at`;
  const scheduledAtErrorId = `${scheduledAtId}-error`;
  const durationId = `${formId}-duration`;
  const durationErrorId = `${durationId}-error`;
  const meetingLinkId = `${formId}-meeting-link`;
  const meetingLinkErrorId = `${meetingLinkId}-error`;
  const locationId = `${formId}-location`;
  const locationErrorId = `${locationId}-error`;
  const notesId = `${formId}-notes`;
  const notesErrorId = `${notesId}-error`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading || submittingRef.current) {
      return;
    }

    const nextErrors: FormErrors = {};
    const trimmedTitle = title.trim();
    const trimmedMeetingLink = meetingLink.trim();

    if (
      !Number.isFinite(jobApplicationId) ||
      jobApplicationId <= 0
    ) {
      nextErrors.jobApplicationId =
        "A valid job application is required.";
    }

    if (!trimmedTitle) {
      nextErrors.title = "Interview title is required.";
    } else if (title.length > 200) {
      nextErrors.title =
        "Interview title must be 200 characters or fewer.";
    }

    const scheduledDate = new Date(scheduledAt);

    if (!scheduledAt) {
      nextErrors.scheduledAt =
        "Interview date and time are required.";
    } else if (
      Number.isNaN(scheduledDate.getTime()) ||
      scheduledDate.getTime() <= Date.now()
    ) {
      nextErrors.scheduledAt =
        "Interview date and time must be in the future.";
    }

    if (
      !Number.isFinite(durationMinutes) ||
      durationMinutes < 15 ||
      durationMinutes > 480
    ) {
      nextErrors.durationMinutes =
        "Duration must be between 15 and 480 minutes.";
    }

    if (meetingLink.length > 500) {
      nextErrors.meetingLink =
        "Meeting link must be 500 characters or fewer.";
    } else if (trimmedMeetingLink) {
      try {
        const parsedMeetingLink = new URL(trimmedMeetingLink);

        if (
          parsedMeetingLink.protocol !== "http:" &&
          parsedMeetingLink.protocol !== "https:"
        ) {
          nextErrors.meetingLink =
            "Meeting link must use http or https.";
        }
      } catch {
        nextErrors.meetingLink =
          "Meeting link must use http or https.";
      }
    }

    if (location.length > 200) {
      nextErrors.location =
        "Location must be 200 characters or fewer.";
    }

    if (notes.length > 3000) {
      nextErrors.notes =
        "Notes must be 3000 characters or fewer.";
    }

    setErrors(nextErrors);
    setMessage("");
    setMessageType(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const request: CreateInterviewRequest = {
      jobApplicationId,
      title: trimmedTitle,
      scheduledAt: scheduledDate.toISOString(),
      durationMinutes,
      meetingLink: trimmedMeetingLink,
      location: location.trim(),
      notes: notes.trim(),
    };

    submittingRef.current = true;
    setLoading(true);

    let createdInterview: InterviewResponse;
    try {
      createdInterview = await createInterview(request);
    } catch (error) {
      if (axios.isAxiosError<BackendErrorResponse>(error)) {
        const responseData = error.response?.data;
        const validationMessage = Object.values(
          responseData?.errors ?? {},
        )
          .flat()
          .find(
            (item) =>
              typeof item === "string" &&
              item.trim().length > 0,
          );

        setMessage(
          responseData?.message?.trim() ||
            validationMessage ||
            "Unable to schedule interview. Please try again.",
        );
      } else {
        setMessage(
          "Unable to schedule interview. Please try again.",
        );
      }
      setMessageType("error");
      return;
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }

    setTitle("Interview");
    setScheduledAt("");
    setDurationMinutes(60);
    setMeetingLink("");
    setLocation("");
    setNotes("");
    setErrors({});
    setMessage("Interview scheduled successfully.");
    setMessageType("success");

    try {
      onCreated(createdInterview);
    } catch (error) {
      console.error(
        "Interview was created, but the page could not update.",
        error,
      );
    }
  };

  return (
    <form
      className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      {errors.jobApplicationId && (
        <p
          className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {errors.jobApplicationId}
        </p>
      )}

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor={titleId}
        >
          Interview title
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          id={titleId}
          type="text"
          maxLength={200}
          value={title}
          aria-describedby={
            errors.title ? titleErrorId : undefined
          }
          aria-invalid={Boolean(errors.title)}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrors((current) => ({
              ...current,
              title: undefined,
            }));
          }}
        />
        {errors.title && (
          <p
            className="mt-1 text-sm text-red-600"
            id={titleErrorId}
          >
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor={scheduledAtId}
        >
          Interview date and time
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          id={scheduledAtId}
          type="datetime-local"
          value={scheduledAt}
          aria-describedby={
            errors.scheduledAt
              ? scheduledAtErrorId
              : undefined
          }
          aria-invalid={Boolean(errors.scheduledAt)}
          onChange={(event) => {
            setScheduledAt(event.target.value);
            setErrors((current) => ({
              ...current,
              scheduledAt: undefined,
            }));
          }}
        />
        {errors.scheduledAt && (
          <p
            className="mt-1 text-sm text-red-600"
            id={scheduledAtErrorId}
          >
            {errors.scheduledAt}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor={durationId}
        >
          Duration in minutes
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          id={durationId}
          type="number"
          min={15}
          max={480}
          value={durationMinutes}
          aria-describedby={
            errors.durationMinutes
              ? durationErrorId
              : undefined
          }
          aria-invalid={Boolean(errors.durationMinutes)}
          onChange={(event) => {
            setDurationMinutes(event.target.valueAsNumber);
            setErrors((current) => ({
              ...current,
              durationMinutes: undefined,
            }));
          }}
        />
        {errors.durationMinutes && (
          <p
            className="mt-1 text-sm text-red-600"
            id={durationErrorId}
          >
            {errors.durationMinutes}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor={meetingLinkId}
        >
          Meeting link
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          id={meetingLinkId}
          type="url"
          maxLength={500}
          value={meetingLink}
          aria-describedby={
            errors.meetingLink
              ? meetingLinkErrorId
              : undefined
          }
          aria-invalid={Boolean(errors.meetingLink)}
          onChange={(event) => {
            setMeetingLink(event.target.value);
            setErrors((current) => ({
              ...current,
              meetingLink: undefined,
            }));
          }}
        />
        {errors.meetingLink && (
          <p
            className="mt-1 text-sm text-red-600"
            id={meetingLinkErrorId}
          >
            {errors.meetingLink}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor={locationId}
        >
          Location
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          id={locationId}
          type="text"
          maxLength={200}
          value={location}
          aria-describedby={
            errors.location
              ? locationErrorId
              : undefined
          }
          aria-invalid={Boolean(errors.location)}
          onChange={(event) => {
            setLocation(event.target.value);
            setErrors((current) => ({
              ...current,
              location: undefined,
            }));
          }}
        />
        {errors.location && (
          <p
            className="mt-1 text-sm text-red-600"
            id={locationErrorId}
          >
            {errors.location}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-700"
          htmlFor={notesId}
        >
          Notes
        </label>
        <textarea
          className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          id={notesId}
          maxLength={3000}
          value={notes}
          aria-describedby={
            errors.notes ? notesErrorId : undefined
          }
          aria-invalid={Boolean(errors.notes)}
          onChange={(event) => {
            setNotes(event.target.value);
            setErrors((current) => ({
              ...current,
              notes: undefined,
            }));
          }}
        />
        {errors.notes && (
          <p
            className="mt-1 text-sm text-red-600"
            id={notesErrorId}
          >
            {errors.notes}
          </p>
        )}
      </div>

      {message && (
        <p
          className={`rounded-md px-4 py-3 text-sm ${
            messageType === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
          role={messageType === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}

      <button
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Scheduling..." : "Schedule interview"}
      </button>
    </form>
  );
}
