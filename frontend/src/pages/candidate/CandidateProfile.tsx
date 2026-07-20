import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { isAxiosError } from "axios";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  LoaderCircle,
  MapPin,
  Phone,
  Save,
  Upload,
  UserCircle2,
} from "lucide-react";

import {
  downloadCandidateResume,
  getCandidateProfile,
  updateCandidateProfile,
  uploadCandidateResume,
} from "../../services/candidateProfileService";

import type {
  CandidateProfile,
  UpdateCandidateProfileRequest,
} from "../../types/candidateProfile";

const emptyForm: UpdateCandidateProfileRequest = {
  phone: "",
  location: "",
  skills: "",
  education: "",
  experienceSummary: "",
};

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  return fallbackMessage;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function CandidateProfile() {
  const [profile, setProfile] =
    useState<CandidateProfile | null>(null);

  const [formData, setFormData] =
    useState<UpdateCandidateProfileRequest>(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getCandidateProfile();

      setProfile(data);

      setFormData({
        phone: data.phone ?? "",
        location: data.location ?? "",
        skills: data.skills ?? "",
        education: data.education ?? "",
        experienceSummary: data.experienceSummary ?? "",
      });
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === 404
      ) {
        setProfile(null);
        setFormData(emptyForm);
        setErrorMessage("");
      } else {
        setErrorMessage(
          getErrorMessage(
            error,
            "We could not load your profile. Please try again.",
          ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  function updateField(
    field: keyof UpdateCandidateProfileRequest,
    value: string,
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSaveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const result = await updateCandidateProfile(formData);

      setProfile(result.profile);
      setSuccessMessage(result.message);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "We could not save your profile. Please try again.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResumeUpload() {
    if (!selectedFile) {
      setErrorMessage("Please select a résumé file first.");
      return;
    }

    const maximumFileSize = 6 * 1024 * 1024;

    if (selectedFile.size > maximumFileSize) {
      setErrorMessage(
        "The résumé file must be smaller than 6 MB.",
      );
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const result = await uploadCandidateResume(selectedFile);

      setProfile((currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              resumeUrl: result.data.downloadUrl,
            }
          : currentProfile,
      );

      setSuccessMessage(result.message);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "We could not upload your résumé. Please try again.",
        ),
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleResumeDownload() {
    try {
      setIsDownloading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const resumeBlob = await downloadCandidateResume();
      const downloadUrl = URL.createObjectURL(resumeBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "candidate-resume";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(downloadUrl);

      setSuccessMessage(
        "Your résumé download has started.",
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "We could not download your résumé.",
        ),
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <span
          className="inline-flex items-center gap-2 rounded-full
            bg-blue-100 px-3 py-1.5 text-xs font-bold
            text-blue-700"
        >
          <UserCircle2 size={15} />
          Candidate profile
        </span>

        <h1
          className="mt-3 text-2xl font-bold text-slate-900
            sm:text-3xl"
        >
          My Profile
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Keep your professional information and résumé updated.
        </p>
      </section>

      {successMessage && (
        <div
          className="flex items-start gap-3 rounded-2xl border
            border-emerald-200 bg-emerald-50 p-4
            text-sm text-emerald-700"
        >
          <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div
          className="flex items-start gap-3 rounded-2xl border
            border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 shrink-0" size={19} />
          <p>{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <section
          className="flex min-h-80 items-center justify-center
            rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="text-center">
            <LoaderCircle
              size={34}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading your profile...
            </p>
          </div>
        </section>
      ) : (
        <>
          <section
            className="rounded-2xl border border-slate-200
              bg-white p-5 shadow-sm sm:p-6"
          >
            <div
              className="flex flex-col gap-4 sm:flex-row
                sm:items-center"
            >
              <div
                className="flex h-16 w-16 shrink-0 items-center
                  justify-center rounded-2xl bg-blue-100
                  text-blue-700"
              >
                <UserCircle2 size={34} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  className="truncate text-xl font-bold
                    text-slate-900"
                >
                  {profile?.fullName || "Candidate"}
                </h2>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {profile?.email ||
                    "Profile information will appear after saving."}
                </p>

                {profile?.updatedAt && (
                  <p className="mt-2 text-xs text-slate-400">
                    Last updated {formatDate(profile.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-slate-200
              bg-white p-5 shadow-sm sm:p-6"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add the information recruiters should know about you.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span
                  className="mb-2 flex items-center gap-2
                    text-sm font-semibold text-slate-700"
                >
                  <Phone size={16} />
                  Phone Number
                </span>

                <input
                  type="tel"
                  maxLength={20}
                  value={formData.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="Enter your phone number"
                  className="h-12 w-full rounded-xl border
                    border-slate-200 bg-slate-50 px-4 text-sm
                    text-slate-900 outline-none
                    transition focus:border-blue-500
                    focus:bg-white focus:ring-4
                    focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span
                  className="mb-2 flex items-center gap-2
                    text-sm font-semibold text-slate-700"
                >
                  <MapPin size={16} />
                  Location
                </span>

                <input
                  type="text"
                  maxLength={150}
                  value={formData.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="Example: Colombo, Sri Lanka"
                  className="h-12 w-full rounded-xl border
                    border-slate-200 bg-slate-50 px-4 text-sm
                    text-slate-900 outline-none
                    transition focus:border-blue-500
                    focus:bg-white focus:ring-4
                    focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="mt-5 space-y-5">
              <label className="block">
                <span
                  className="mb-2 flex items-center gap-2
                    text-sm font-semibold text-slate-700"
                >
                  <BriefcaseBusiness size={16} />
                  Skills
                </span>

                <textarea
                  rows={4}
                  maxLength={2000}
                  value={formData.skills}
                  onChange={(event) =>
                    updateField("skills", event.target.value)
                  }
                  placeholder="Example: React, TypeScript, UI design"
                  className="w-full resize-y rounded-xl border
                    border-slate-200 bg-slate-50 px-4 py-3
                    text-sm text-slate-900 outline-none
                    transition focus:border-blue-500
                    focus:bg-white focus:ring-4
                    focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span
                  className="mb-2 flex items-center gap-2
                    text-sm font-semibold text-slate-700"
                >
                  <GraduationCap size={16} />
                  Education
                </span>

                <textarea
                  rows={4}
                  maxLength={2000}
                  value={formData.education}
                  onChange={(event) =>
                    updateField("education", event.target.value)
                  }
                  placeholder="Describe your education and qualifications"
                  className="w-full resize-y rounded-xl border
                    border-slate-200 bg-slate-50 px-4 py-3
                    text-sm text-slate-900 outline-none
                    transition focus:border-blue-500
                    focus:bg-white focus:ring-4
                    focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span
                  className="mb-2 flex items-center gap-2
                    text-sm font-semibold text-slate-700"
                >
                  <FileText size={16} />
                  Experience Summary
                </span>

                <textarea
                  rows={5}
                  maxLength={4000}
                  value={formData.experienceSummary}
                  onChange={(event) =>
                    updateField(
                      "experienceSummary",
                      event.target.value,
                    )
                  }
                  placeholder="Describe your work experience and projects"
                  className="w-full resize-y rounded-xl border
                    border-slate-200 bg-slate-50 px-4 py-3
                    text-sm text-slate-900 outline-none
                    transition focus:border-blue-500
                    focus:bg-white focus:ring-4
                    focus:ring-blue-100"
                />
              </label>
            </div>

            <div
              className="mt-6 flex justify-end border-t
                border-slate-100 pt-5"
            >
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-11 items-center
                  justify-center gap-2 rounded-xl bg-blue-600
                  px-5 text-sm font-bold text-white transition
                  hover:bg-blue-700 disabled:cursor-not-allowed
                  disabled:opacity-60"
              >
                {isSaving ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={18} />
                )}

                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>

          <section
            className="rounded-2xl border border-slate-200
              bg-white p-5 shadow-sm sm:p-6"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Résumé
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload a PDF, DOC, or DOCX file smaller than 6 MB.
              </p>
            </div>

            <div
              className="mt-5 rounded-2xl border-2
                border-dashed border-slate-200 bg-slate-50 p-5"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => {
                  setSelectedFile(
                    event.target.files?.[0] ?? null,
                  );

                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="block w-full text-sm text-slate-600
                  file:mr-4 file:rounded-lg file:border-0
                  file:bg-blue-100 file:px-4 file:py-2.5
                  file:text-sm file:font-bold file:text-blue-700
                  hover:file:bg-blue-200"
              />

              {selectedFile && (
                <p className="mt-3 text-sm text-slate-600">
                  Selected:{" "}
                  <span className="font-semibold">
                    {selectedFile.name}
                  </span>
                </p>
              )}
            </div>

            <div
              className="mt-5 flex flex-col gap-3
                sm:flex-row sm:justify-end"
            >
              <button
                type="button"
                onClick={() => void handleResumeDownload()}
                disabled={
                  isDownloading || !profile?.resumeUrl
                }
                className="inline-flex h-11 items-center
                  justify-center gap-2 rounded-xl border
                  border-slate-200 bg-white px-5 text-sm
                  font-bold text-slate-700 transition
                  hover:bg-slate-50 disabled:cursor-not-allowed
                  disabled:opacity-50"
              >
                {isDownloading ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Download size={18} />
                )}

                {isDownloading
                  ? "Downloading..."
                  : "Download Résumé"}
              </button>

              <button
                type="button"
                onClick={() => void handleResumeUpload()}
                disabled={isUploading || !selectedFile}
                className="inline-flex h-11 items-center
                  justify-center gap-2 rounded-xl bg-blue-600
                  px-5 text-sm font-bold text-white transition
                  hover:bg-blue-700 disabled:cursor-not-allowed
                  disabled:opacity-60"
              >
                {isUploading ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Upload size={18} />
                )}

                {isUploading
                  ? "Uploading..."
                  : "Upload Résumé"}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}