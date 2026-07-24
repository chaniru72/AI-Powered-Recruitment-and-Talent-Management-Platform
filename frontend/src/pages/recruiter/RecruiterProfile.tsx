import "./RecruiterProfile.css";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { isAxiosError } from "axios";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import {
  getRecruiterProfile,
  updateRecruiterProfile,
} from "../../services/recruiterProfileService";

import type {
  RecruiterProfile,
  UpdateRecruiterProfileRequest,
} from "../../types/recruiterProfile";

type StoredUser = {
  fullName?: string;
  email?: string;
  role?: string;
};

const emptyForm: UpdateRecruiterProfileRequest = {
  phone: "",
  organizationName: "",
  designation: "",
  bio: "",
};

function getStoredUser(): StoredUser {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return {};
  }

  try {
    return JSON.parse(storedUser) as StoredUser;
  } catch {
    return {};
  }
}

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return "Not available";
  }

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

export default function RecruiterProfile() {
  const storedUser = getStoredUser();

  const [profile, setProfile] =
    useState<RecruiterProfile | null>(null);

  const [formData, setFormData] =
    useState<UpdateRecruiterProfileRequest>(emptyForm);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEndpointPending, setIsEndpointPending] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setIsEndpointPending(false);

      const data = await getRecruiterProfile();

      setProfile(data);

      setFormData({
        phone: data.phone ?? "",
        organizationName: data.organizationName ?? "",
        designation: data.designation ?? "",
        bio: data.bio ?? "",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "Recruiter profile API endpoint is not configured."
      ) {
        setIsEndpointPending(true);
        setProfile(null);
        setFormData(emptyForm);
        return;
      }

      if (
        isAxiosError(error) &&
        error.response?.status === 404
      ) {
        setProfile(null);
        setFormData(emptyForm);
        return;
      }

      setErrorMessage(
        getErrorMessage(
          error,
          "We could not load the recruiter profile.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  function updateField(
    field: keyof UpdateRecruiterProfileRequest,
    value: string,
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  async function handleSaveProfile(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isEndpointPending) {
      setErrorMessage(
        "Connect the recruiter profile API endpoint before saving.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const result = await updateRecruiterProfile(formData);

      setProfile(result.profile);
      setSuccessMessage(result.message);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "We could not save the recruiter profile.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const displayName =
    profile?.fullName ||
    storedUser.fullName ||
    "Recruiter";

  const displayEmail =
    profile?.email ||
    storedUser.email ||
    "Email not available";

  const displayRole =
    profile?.role ||
    storedUser.role ||
    "Recruiter";

  return (
    <div className="recruiter-profile-page">
      <section className="recruiter-profile-hero">
        <div>
          <span className="recruiter-profile-eyebrow">
            <UserCircle2 size={16} />
            Recruiter profile
          </span>

          <h1>Profile settings</h1>

          <p>
            Manage your recruiter contact and organization
            information.
          </p>
        </div>

        <div className="recruiter-profile-role-badge">
          <ShieldCheck size={18} />
          {displayRole}
        </div>
      </section>

      {isEndpointPending && (
        <div className="recruiter-profile-pending">
          <AlertCircle size={19} />

          <div>
            <strong>Backend connection pending</strong>

            <p>
              The recruiter profile interface is ready.
              Connect the recruiter profile endpoint when the
              backend becomes available.
            </p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="recruiter-profile-message is-success">
          <CheckCircle2 size={19} />
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="recruiter-profile-message is-error">
          <AlertCircle size={19} />
          <p>{errorMessage}</p>
        </div>
      )}

      {isLoading ? (
        <section className="recruiter-profile-loading">
          <LoaderCircle
            size={34}
            className="is-spinning"
          />

          <p>Loading recruiter profile...</p>
        </section>
      ) : (
        <>
          <section className="recruiter-profile-summary">
            <div className="recruiter-profile-avatar">
              <UserCircle2 size={38} />
            </div>

            <div className="recruiter-profile-summary-content">
              <h2>{displayName}</h2>

              <div className="recruiter-profile-email">
                <Mail size={16} />
                <span>{displayEmail}</span>
              </div>

              {profile?.updatedAt && (
                <p>
                  Last updated{" "}
                  {formatDate(profile.updatedAt)}
                </p>
              )}
            </div>
          </section>

          <form
            className="recruiter-profile-form-card"
            onSubmit={handleSaveProfile}
          >
            <div className="recruiter-profile-section-heading">
              <div>
                <span>PROFILE INFORMATION</span>
                <h2>Professional details</h2>

                <p>
                  Update the information connected to your
                  recruiter account.
                </p>
              </div>
            </div>

            <div className="recruiter-profile-grid">
              <label className="recruiter-profile-field">
                <span>
                  <Phone size={16} />
                  Phone number
                </span>

                <input
                  type="tel"
                  maxLength={20}
                  value={formData.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="Enter phone number"
                  disabled={isEndpointPending}
                />
              </label>

              <label className="recruiter-profile-field">
                <span>
                  <Building2 size={16} />
                  Organization
                </span>

                <input
                  type="text"
                  maxLength={150}
                  value={formData.organizationName}
                  onChange={(event) =>
                    updateField(
                      "organizationName",
                      event.target.value,
                    )
                  }
                  placeholder="Enter organization name"
                  disabled={isEndpointPending}
                />
              </label>

              <label className="recruiter-profile-field">
                <span>
                  <ShieldCheck size={16} />
                  Designation
                </span>

                <input
                  type="text"
                  maxLength={120}
                  value={formData.designation}
                  onChange={(event) =>
                    updateField(
                      "designation",
                      event.target.value,
                    )
                  }
                  placeholder="Enter recruiter designation"
                  disabled={isEndpointPending}
                />
              </label>

              <label className="recruiter-profile-field">
                <span>
                  <Mail size={16} />
                  Account email
                </span>

                <input
                  type="email"
                  value={displayEmail}
                  readOnly
                />
              </label>
            </div>

            <label className="recruiter-profile-field recruiter-profile-bio">
              <span>
                <UserCircle2 size={16} />
                Professional bio
              </span>

              <textarea
                rows={6}
                maxLength={2000}
                value={formData.bio}
                onChange={(event) =>
                  updateField("bio", event.target.value)
                }
                placeholder="Add a short professional description"
                disabled={isEndpointPending}
              />
            </label>

            <div className="recruiter-profile-actions">
              <button
                type="submit"
                disabled={isSaving || isEndpointPending}
              >
                {isSaving ? (
                  <LoaderCircle
                    size={18}
                    className="is-spinning"
                  />
                ) : (
                  <Save size={18} />
                )}

                {isSaving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}