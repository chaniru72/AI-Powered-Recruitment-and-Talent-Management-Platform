import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

import "./LoginPage.css";

type Mode = "signin" | "signup";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setErrors({});
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);

    window.history.replaceState(
      null,
      "",
      newMode === "signup" ? "#signup" : "#signin",
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: FormErrors = {};

    if (mode === "signup" && name.trim().length < 3) {
      newErrors.name = "Please enter your full name.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Use at least 8 characters.";
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    setMessage("");

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    // Temporary response. Replace with the real backend request later.
    window.setTimeout(() => {
      setLoading(false);

      if (mode === "signin") {
        setMessage(
          "Demo login successful. Backend authentication will be connected later.",
        );
      } else {
        setMessage(
          "Demo account created successfully. Registration API will be connected later.",
        );
      }
    }, 800);
  };

  return (
    <main className="login-page auth-login-page">
      <div className="auth2-shell">
        {/* LEFT: LOGIN FORM */}
        <section className="auth2-form-panel">
          <div className="auth2-form-inner">
            <a className="auth2-brand" href="/login">
              <span className="auth2-logo" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>

              <span className="auth2-brand-name">
                TalentSync <strong>AI</strong>
              </span>
            </a>

            <div
              className={`auth2-form-content ${
                mode === "signup" ? "auth2-signup" : ""
              }`}
            >
              <header className="auth2-header">
                <h1>
                  {mode === "signin"
                    ? "Welcome back"
                    : "Create your account"}
                </h1>

                <p>
                  {mode === "signin"
                    ? "Sign in to continue to TalentSync AI"
                    : "Join TalentSync AI and start your career journey"}
                </p>
              </header>

              <form onSubmit={handleSubmit} noValidate>
                {mode === "signup" && (
                  <div className="auth2-group">
                    <label htmlFor="name">Full name</label>

                    <div
                      className={`auth2-input ${
                        errors.name ? "auth2-input-error" : ""
                      }`}
                    >
                      <UserRound size={20} />

                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        autoComplete="name"
                        onChange={(event) => {
                          setName(event.target.value);

                          setErrors((current) => ({
                            ...current,
                            name: undefined,
                          }));
                        }}
                      />
                    </div>

                    {errors.name && (
                      <small className="auth2-error" role="alert">
                        {errors.name}
                      </small>
                    )}
                  </div>
                )}

                <div className="auth2-group">
                  <label htmlFor="email">Email address</label>

                  <div
                    className={`auth2-input ${
                      errors.email ? "auth2-input-error" : ""
                    }`}
                  >
                    <Mail size={20} />

                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      autoComplete="email"
                      onChange={(event) => {
                        setEmail(event.target.value);

                        setErrors((current) => ({
                          ...current,
                          email: undefined,
                        }));
                      }}
                    />
                  </div>

                  {errors.email && (
                    <small className="auth2-error" role="alert">
                      {errors.email}
                    </small>
                  )}
                </div>

                <div className="auth2-group">
                  <label htmlFor="password">Password</label>

                  <div
                    className={`auth2-input ${
                      errors.password ? "auth2-input-error" : ""
                    }`}
                  >
                    <LockKeyhole size={20} />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      autoComplete={
                        mode === "signin"
                          ? "current-password"
                          : "new-password"
                      }
                      onChange={(event) => {
                        setPassword(event.target.value);

                        setErrors((current) => ({
                          ...current,
                          password: undefined,
                        }));
                      }}
                    />

                    <button
                      className="auth2-password-button"
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() => {
                        setShowPassword((current) => !current);
                      }}
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <small className="auth2-error" role="alert">
                      {errors.password}
                    </small>
                  )}
                </div>

                {mode === "signup" && (
                  <div className="auth2-group">
                    <label htmlFor="confirmPassword">
                      Confirm password
                    </label>

                    <div
                      className={`auth2-input ${
                        errors.confirmPassword
                          ? "auth2-input-error"
                          : ""
                      }`}
                    >
                      <LockKeyhole size={20} />

                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password again"
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);

                          setErrors((current) => ({
                            ...current,
                            confirmPassword: undefined,
                          }));
                        }}
                      />
                    </div>

                    {errors.confirmPassword && (
                      <small className="auth2-error" role="alert">
                        {errors.confirmPassword}
                      </small>
                    )}
                  </div>
                )}

                {mode === "signin" && (
                  <div className="auth2-options">
                    <label className="auth2-remember">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => {
                          setRememberMe(event.target.checked);
                        }}
                      />

                      <span>Remember me</span>
                    </label>

                    <a href="#forgot-password">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  className="auth2-submit"
                  type="submit"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "Please wait..."
                      : mode === "signin"
                        ? "Sign In"
                        : "Create Account"}
                  </span>

                  {!loading && <ArrowRight size={21} />}
                </button>

                {message && (
                  <div className="auth2-message" role="status">
                    {message}
                  </div>
                )}
              </form>

              {mode === "signin" && (
                <>
                  <div className="auth2-divider">
                    <span>or</span>
                  </div>

                  <button
                    className="auth2-google"
                    type="button"
                    onClick={() => {
                      setMessage(
                        "Google authentication will be connected through the backend later.",
                      );
                    }}
                  >
                    <span className="auth2-google-symbol">
                      G
                    </span>

                    <span>Continue with Google</span>
                  </button>
                </>
              )}

              <p className="auth2-switch">
                <span>
                  {mode === "signin"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    changeMode(
                      mode === "signin" ? "signup" : "signin",
                    );
                  }}
                >
                  {mode === "signin" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

            <div className="auth2-secure">
              <ShieldCheck size={28} />
              <span>Secure enterprise access</span>
            </div>
          </div>
        </section>

        {/* RIGHT: ANIMATED RECRUITMENT VISUAL */}
        <section
          className="auth2-visual-panel"
          aria-label="TalentSync AI recruitment platform"
        >
          <span className="auth2-glow auth2-glow-one" />
          <span className="auth2-glow auth2-glow-two" />
          <span className="auth2-particle auth2-particle-one" />
          <span className="auth2-particle auth2-particle-two" />
          <span className="auth2-particle auth2-particle-three" />

          <div className="auth2-visual-content">
            <h2>
              <span>Smarter</span> hiring.
              <br />
              <span>Stronger</span> teams.
            </h2>

            <p>
              Find the right talent with intelligent matching.
            </p>

            <div
              className="auth2-pipeline"
              aria-label="Candidate matching process"
            >
              <div className="auth2-node">
                <UserRound size={34} />
              </div>

              <div className="auth2-connection">
                <i />
              </div>

              <div className="auth2-node auth2-ai-node">
                <Sparkles size={38} />
              </div>

              <div className="auth2-connection">
                <i />
              </div>

              <div className="auth2-node">
                <UsersRound size={36} />
              </div>
            </div>

            <p className="auth2-caption">
              AI-powered recruitment and talent management
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}