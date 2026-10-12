import { magicLinkEnabled, passwordLoginEnabled } from "@/lib/auth";
import { MagicLinkForm, PasswordForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage({ searchParams }: { searchParams: { erreur?: string } }) {
  const password = passwordLoginEnabled();
  const magic = magicLinkEnabled();

  return (
    <div className="mx-auto mt-10 max-w-md bg-white p-8 shadow-sm md:mt-20">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Connexion</h1>
      {searchParams.erreur && (
        <p className="admin-alert mt-5">Ce lien n&apos;est plus valable (déjà utilisé ou expiré). Demandez-en un nouveau.</p>
      )}

      {password && <PasswordForm />}

      {magic && (
        <div className={password ? "mt-8 border-t border-ink/10 pt-6" : ""}>
          <p className="mt-2 text-sm text-lin">
            {password ? "Ou recevez" : "Saisissez votre adresse e-mail : vous recevrez"} un lien de connexion par e-mail, valable 15 minutes.
          </p>
          <MagicLinkForm />
        </div>
      )}

      {!password && !magic && (
        <p className="admin-alert mt-5">
          Aucune méthode de connexion n&apos;est configurée (variables ADMIN_PASSWORD ou BREVO_API_KEY).
        </p>
      )}
    </div>
  );
}
