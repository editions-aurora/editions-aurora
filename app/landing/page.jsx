"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/Dropzone";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();
  const [childId, setChildId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("childId");
    if (!id) return;

    setChildId(id);

    // ✅ Abonnement Supabase v2
    const channel = supabase
      .channel(`child_id-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "uploads", filter: `child_id=eq.${id}` },
        (payload) => {
          console.log("Update reçu :", payload);
          if (payload.new.status === "done") {
            router.replace(`/books/${id}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
          <li>Le workflow N8N analyse et enrichit les données.</li>
        </ul>
      </section>

      {childId && (
        <div style={{ marginTop: 24 }}>
          Redirection en cours vers la page personnalisée...
        </div>
      )}
    </main>
  );
}
