import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Create Your Equiti Gate Account
          </h1>

          <p className="text-muted-foreground mt-2">
            Start your journey into global property investment.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}