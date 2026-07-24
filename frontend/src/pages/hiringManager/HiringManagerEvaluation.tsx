import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";

import { submitInterviewEvaluation } from "../../services/hiringManagerEvaluationService";

import type { InterviewEvaluation } from "../../types/hiringManager";

type EvaluationForm = {
  technicalScore: string;
  communicationScore: string;
  experienceScore: string;
  comments: string;
};

const initialForm: EvaluationForm = {
  technicalScore: "",
  communicationScore: "",
  experienceScore: "",
  comments: "",
};

export default function HiringManagerEvaluation() {
  const { interviewId: interviewIdParameter } = useParams<{
    interviewId: string;
  }>();

  const interviewId = Number(interviewIdParameter);

  const [form, setForm] =
    useState<EvaluationForm>(initialForm);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const overallScore = useMemo(() => {
    const scores = [
      Number(form.technicalScore),
      Number(form.communicationScore),
      Number(form.experienceScore),
    ];

    if (
      scores.some(
        (score) =>
          !Number.isFinite(score) ||
          score < 0 ||
          score > 10,
      )
    ) {
      return 0;
    }

    const total = scores.reduce(
      (sum, score) => sum + score,
      0,
    );

    return Number((total / scores.length).toFixed(2));
  }, [
    form.technicalScore,
    form.communicationScore,
    form.experienceScore,
  ]);

  function updateFormField(
    field: keyof EvaluationForm,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

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
        "A valid interview must be selected before submitting an evaluation.",
      );

      return;
    }

    const technicalScore = Number(
      form.technicalScore,
    );

    const communicationScore = Number(
      form.communicationScore,
    );

    const experienceScore = Number(
      form.experienceScore,
    );

    const scores = [
      technicalScore,
      communicationScore,
      experienceScore,
    ];

    if (
      scores.some(
        (score) =>
          !Number.isFinite(score) ||
          score < 0 ||
          score > 10,
      )
    ) {
      setErrorMessage(
        "Each score must be between 0 and 10.",
      );

      return;
    }

    const evaluation: InterviewEvaluation = {
      interviewId,
      technicalScore,
      communicationScore,
      experienceScore,
      overallScore,
      comments: form.comments.trim(),
    };

    try {
      setIsSubmitting(true);

      await submitInterviewEvaluation(evaluation);

      setSuccessMessage(
        "The interview evaluation was submitted successfully.",
      );

      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit the interview evaluation.";

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
          Interview Evaluation
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Record the candidate evaluation after completing
          the interview.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              Technical Score
            </span>

            <input
              type="number"
              min="0"
              max="10"
              step="1"
              required
              value={form.technicalScore}
              onChange={(event) =>
                updateFormField(
                  "technicalScore",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="0 - 10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              Communication Score
            </span>

            <input
              type="number"
              min="0"
              max="10"
              step="1"
              required
              value={form.communicationScore}
              onChange={(event) =>
                updateFormField(
                  "communicationScore",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="0 - 10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-800">
              Experience Score
            </span>

            <input
              type="number"
              min="0"
              max="10"
              step="1"
              required
              value={form.experienceScore}
              onChange={(event) =>
                updateFormField(
                  "experienceScore",
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="0 - 10"
            />
          </label>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            Calculated overall score
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-950">
            {overallScore.toFixed(2)} / 10
          </p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-800">
            Evaluation Comments
          </span>

          <textarea
            rows={5}
            value={form.comments}
            onChange={(event) =>
              updateFormField(
                "comments",
                event.target.value,
              )
            }
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Enter the interview evaluation comments"
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
              : "Submit Evaluation"}
          </button>
        </div>
      </form>
    </section>
  );
}