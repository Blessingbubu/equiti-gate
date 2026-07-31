import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back to Equiti Gate
          </h1>

          <p className="text-muted-foreground mt-2">
            Login to access your real estate investment account.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}