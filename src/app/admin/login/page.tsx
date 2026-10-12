import { LoginForm } from "./LoginForm";

export default function LoginPage({ searchParams }: { searchParams: { erreur?: string } }) {
  return (
    <div className="mx-auto mt-10 max-w-md bg-white p-8 shadow-sm md:mt-20">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Connexion</h1>
      <p className="mt-2 text-sm text-lin">
        Saisissez votre adresse e-mail : vous recevrez un lien de connexion valable 15 minutes.
      </p>
      {searchParams.erreur && (
        <p className="admin-alert mt-5">Ce lien n&apos;est plus valable (déjà utilisé ou expiré). Demandez-en un nouveau.</p>
      )}
      <LoginForm />
    </div>
  );
}
