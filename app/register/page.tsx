import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          Backoffice telecom
        </p>
        <h1 className="mt-1 font-semibold text-2xl tracking-tight">
          Sistema CleanUp
        </h1>
      </div>
      <RegisterForm />
    </div>
  );
}
