"use client";

import { useFormState, useFormStatus } from "react-dom";
import { passwordLoginAction, requestLoginAction, type LoginState } from "../actions";

function Submit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="admin-btn w-full">
      {pending ? pendingLabel : label}
    </button>
  );
}

const EmailInput = () => (
  <label className="block">
    <span className="admin-label">Adresse e-mail</span>
    <input type="email" name="email" required autoComplete="email" placeholder="prenom@lacasadeanna.com" className="admin-input" />
  </label>
);

export function PasswordForm() {
  const [state, action] = useFormState<LoginState, FormData>(passwordLoginAction, { status: "idle" });
  return (
    <form action={action} className="mt-6 space-y-4">
      <EmailInput />
      <label className="block">
        <span className="admin-label">Mot de passe</span>
        <input type="password" name="password" required autoComplete="current-password" className="admin-input" />
      </label>
      {state.status === "error" && <p className="admin-alert">{state.message}</p>}
      <Submit label="Me connecter" pendingLabel="Connexion…" />
    </form>
  );
}

export function MagicLinkForm() {
  const [state, action] = useFormState<LoginState, FormData>(requestLoginAction, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="mt-4">
        <p className="admin-success">
          C&apos;est envoyé ! Si cette adresse est autorisée, un e-mail arrive dans quelques instants.
          Pensez à vérifier les courriers indésirables.
        </p>
        {state.devLink && (
          <p className="mt-4 break-all text-xs text-lin">
            Mode développement : <a href={state.devLink} className="underline">{state.devLink}</a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="mt-4 space-y-4">
      <EmailInput />
      {state.status === "error" && <p className="admin-alert">{state.message}</p>}
      <Submit label="Recevoir mon lien de connexion" pendingLabel="Envoi…" />
    </form>
  );
}
