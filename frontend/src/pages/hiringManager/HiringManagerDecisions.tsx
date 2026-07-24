import { useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";

import { submitHiringDecision } from "../../services/hiringManagerDecisionService";

import type {
  HiringDecision,
  HiringDecisionStatus,
} from "../../types/hiringManager";

export default function HiringManagerDecisions() {
  const {
    interviewId: interviewIdParameter,
    applicationId: applicationIdParameter,
  } = useParams<{
    interviewId: string;
    applicationId: string;
  }>();

  const interviewId = Number(interviewIdParameter);
  const applicationId = Number(applicationIdParameter);

  const [status, setStatus] =
    useState<HiringDecisionStatus | "">("");

  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !Number.isInteger(interviewId) ||
      interviewId <= 0
    ) {
      setErrorMessage(
        "A valid interview must be selected.",
      );

      return;
    }

    if (
      !Number.isInteger(applicationId) ||
      applicationId <= 0
    ) {
      setErrorMessage(
        "A valid job application must be selected.",
      );

      return;
    }

    if (!status) {
      setErrorMessage(
        "Please select a hiring decision.",
      );

      return;
    }

    const decision: HiringDecision = {
      interviewId,
      applicationId,
      status,
      comments: comments.trim(),
    };

    try {
      setIsSubmitting(true);

      await submitHiringDecision(decision);

      setSuccessMessage(
        "The hiring decision was submitted successfully.",
      );

      setStatus("");
      setComments("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit the hiring decision.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Hiring Manager Workspace
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-950">
          Hiring Decision
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Record the final recommendation after reviewing
          the interview and candidate evaluation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Select Decision
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:border-blue-400">
              <input
                type="radio"
                name="decision"
                value="Approved"
                checked={status === "Approved"}
                onChange={() => setStatus("Approved")}
                className="mr-3"
              />

              <span className="font-semibold text-slate-900">
                Approve Candidate
              </span>
            </label>

            <label className="cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:border-blue-400">
              <input
                type="radio"
                name="decision"
                value="Rejected"
                checked={status === "Rejected"}
                onChange={() => setStatus("Rejected")}
                className="mr-3"
              />

              <span className="font-semibold text-slate-900">
                Reject Candidate
              </span>
            </label>

            <label className="cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:border-blue-400">
              <input
                type="radio"
                name="decision"
                value="AdditionalInterview"
                checked={
                  status === "AdditionalInterview"
                }
                onChange={() =>
                  setStatus("AdditionalInterview")
                }
                className="mr-3"
              />

              <span className="font-semibold text-slate-900">
                Additional Interview
              </span>
            </label>
          </div>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-800">
            Decision Comments
          </span>

          <textarea
            rows={5}
            value={comments}
            onChange={(event) =>
              setComments(event.target.value)
            }
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter the reason or recommendation"
          />
        </label>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Decision"}
          </button>
        </div>
      </form>
    </section>
  );
}