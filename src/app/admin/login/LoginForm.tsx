"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestLoginAction, type LoginState } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="admin-btn w-full">
      {pending ? "Envoi…" : "Recevoir mon lien de connexion"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(requestLoginAction, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="mt-6">
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
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="admin-label">Adresse e-mail</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="prenom@lacasadeanna.com"
          className="admin-input"
        />
      </label>
      {state.status === "error" && <p className="admin-alert">{state.message}</p>}
      <Submit />
    </form>
  );
}
