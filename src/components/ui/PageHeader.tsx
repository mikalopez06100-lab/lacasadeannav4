/** En-tête de page interne — dégage la nav fixe, titre Fraunces signature. */
export function PageHeader({
  label,
  title,
  intro,
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <header className="container-x pb-12 pt-28 md:pb-16 md:pt-36">
      <p className="label text-lin">{label}</p>
      <h1 className="display-h1 mt-4">{title}</h1>
      {intro && <p className="mt-8 max-w-prose text-lin">{intro}</p>}
    </header>
  );
}
