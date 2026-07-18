import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

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
      newMode === "signup" ? "#signup" : "#signin"
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

    window.setTimeout(() => {
      setLoading(false);

      if (mode === "signin") {
        setMessage(
          "Demo login successful. Backend authentication will be connected later."
        );
      } else {
        setMessage(
          "Demo account created successfully. Registration API will be connected later."
        );
      }
    }, 800);
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="brand-section">
          <div className="brand-logo">
            <div className="logo-symbol" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="brand-name">
              TalentSync <strong>AI</strong>
            </div>
          </div>

          <div className="brand-content">
            <h1>
              Smarter hiring.
              <br />
              Stronger teams.
            </h1>

            <p>
              AI-powered recruitment and talent management that helps you find,
              engage and grow exceptional talent.
            </p>
          </div>

          <div className="talent-illustration" aria-hidden="true">
            <div className="light-column light-column-one" />
            <div className="light-column light-column-two" />
            <div className="light-column light-column-three" />

            <div className="glass-card">
              <div className="people-icon">
                <span className="person person-left" />
                <span className="person person-right" />
              </div>
            </div>

            <div className="pedestal-top" />
            <div className="pedestal-base" />
          </div>
        </section>

        <section className="form-section">
          <div
            className={`form-wrapper ${
              mode === "signup" ? "signup-mode" : ""
            }`}
          >
            <header className="form-header">
              <h2>
                {mode === "signin"
                  ? "Welcome back"
                  : "Create account"}
              </h2>

              <p>
                {mode === "signin"
                  ? "Sign in to continue to TalentSync AI"
                  : "Create your TalentSync AI candidate account"}
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="name">Full name</label>

                  <div
                    className={`input-container ${
                      errors.name ? "input-error" : ""
                    }`}
                  >
                    <UserRound size={19} />

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
                    <small className="error-message">
                      {errors.name}
                    </small>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email address</label>

                <div
                  className={`input-container ${
                    errors.email ? "input-error" : ""
                  }`}
                >
                  <Mail size={19} />

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
                  <small className="error-message">
                    {errors.email}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div
                  className={`input-container ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <LockKeyhole size={19} />

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
                    className="password-button"
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
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <small className="error-message">
                    {errors.password}
                  </small>
                )}
              </div>

              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm password
                  </label>

                  <div
                    className={`input-container ${
                      errors.confirmPassword ? "input-error" : ""
                    }`}
                  >
                    <LockKeyhole size={19} />

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
                    <small className="error-message">
                      {errors.confirmPassword}
                    </small>
                  )}
                </div>
              )}

              {mode === "signin" && (
                <div className="form-options">
                  <label className="remember-option">
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
                className="login-button"
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

                {!loading && <ArrowRight size={20} />}
              </button>

              {message && (
                <div className="success-message" role="status">
                  {message}
                </div>
              )}
            </form>

            {mode === "signin" && (
              <>
                <div className="divider">
                  <span>or</span>
                </div>

                <button
                  className="google-button"
                  type="button"
                  onClick={() => {
                    setMessage(
                      "Google authentication will be connected through the backend later."
                    );
                  }}
                >
                  <span className="google-symbol">G</span>
                  <span>Continue with Google</span>
                </button>
              </>
            )}

            <p className="signup-text">
              <span>
                {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (mode === "signin") {
                    changeMode("signup");
                  } else {
                    changeMode("signin");
                  }
                }}
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}