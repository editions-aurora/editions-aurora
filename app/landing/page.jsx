"use client";

import Dropzone from "@/components/Dropzone";

export default function LandingPage() {
  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px" }}>
      <h1>Créer mon livre personnalisé</h1>
      <p>Glisse-dépose des photos de l’enfant pour démarrer.</p>

      <Dropzone />

      <section style={{ marginTop: 32 }}>
        <h2>Et ensuite ?</h2>
        <ul>
          <li>Les photos sont stockées dans Supabase Storage.</li>
          <li>Le workflow N8N pourra analyser et enrichir les données.</li>
        </ul>
      </section>
    </main>
  );
}
