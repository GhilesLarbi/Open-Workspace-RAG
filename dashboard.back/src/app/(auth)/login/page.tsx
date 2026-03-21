import { AuthCard } from "../_components/auth-card";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your organization"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/signup"
    >
      <LoginForm />
    </AuthCard>
  );
}