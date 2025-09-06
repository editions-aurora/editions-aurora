"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/Dropzone";

export default function LandingPage() {
  const router = useRouter();
  const [childId, setChildId] = useState(null); // <-- nouveau state

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("childId");
    console.log("childId détecté :", id);
    setChildId(id); // <-- on met à jour le state

    if (id) {
      router.replace(`/books/${id}`);
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

      {/* Message de redirection uniquement après hydratation */}
      {childId && (
        <div style={{ marginTop: 24 }}>
          Redirection en cours vers la page personnalisée...
        </div>
      )}
    </main>
  );
}
