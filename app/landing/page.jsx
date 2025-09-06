"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/Dropzone";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    // 1️⃣ Récupère childId depuis la query string
    const params = new URLSearchParams(window.location.search);
    const id = params.get("childId");
    if (!id) return;
    setChildId(id);

    // 2️⃣ Écoute les updates sur la table 'uploads' pour ce childId
    const subscription = supabase
      .from(`uploads:child_id=eq.${id}`)
      .on("UPDATE", payload => {
        if (payload.new.status === "done") {
          router.replace(`/books/${id}`);
        }
      })
      .subscribe();

    // 3️⃣ Cleanup à la destruction du composant
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [router]);

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px" }}>
      <h1>Créer mon livre personnalisé</h1>
      <p>Glisse-dépose des photos de l’enfant pour démarrer.</p>

      <Dropzone />

      {childId && (
        <div style={{ marginTop: 24 }}>
          Redirection en cours vers la page personnalisée...
        </div>
      )}
    </main>
  );
}
