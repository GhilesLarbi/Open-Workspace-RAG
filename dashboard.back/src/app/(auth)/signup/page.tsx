import { AuthCard } from "../_components/auth-card";
import { SignupForm } from "./_components/signup-form";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create an organization"
      description="Enter your details to get started"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      <SignupForm />
    </AuthCard>
  );
}