"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/Dropzone";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Récupère le childId depuis la query string
    const params = new URLSearchParams(window.location.search);
    const childId = params.get("childId");
    console.log("childId détecté :", childId);
    // Si un childId est fourni, redirige automatiquement vers /books/[childId]
    if (childId) {
      router.replace(`/books/${childId}`);
    }
  }, [router]);

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

      {/*
        Optionnel : message de redirection si childId est présent
      */}
      <div id="redirect-message" style={{ marginTop: 24 }}>
        {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("childId")
          ? "Redirection en cours vers la page personnalisée..."
          : null}
      </div>
    </main>
  );
}
