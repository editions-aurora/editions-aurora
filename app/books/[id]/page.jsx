export async function generateStaticParams() {
  return Array.from({ length: 14 }, (_, i) => ({ id: String(i + 1) }));
}

export default function BookVariantPage({ params }) {
  const { id } = params;

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px" }}>
      <h1>Version de livre #{id}</h1>
      <p>
        Ceci est la page statique pré-générée pour la variante <strong>{id}</strong>.
      </p>
      <section style={{ marginTop: 24 }}>
        <h2>Contenu de la variante {id}</h2>
        <p>
          Ajoute ici ta mise en page, images, et zones de texte (ex: prénom, etc.).
        </p>
      </section>
    </main>
  );
}
