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

    // 🔹 Abonnement Supabase Realtime (v2)
    const channel = supabase
      .channel(`child_id-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "uploads",
          filter: `childId=eq.${id}`
        },
        (payload) => {
          console.log("Update reçu pour childId", id, ":", payload);
          if (payload.new?.status === "done") {
            console.log("Status done → redirection vers /books/" + id);
            router.replace(`/books/${id}`);
          }
        }
      )
      .subscribe();

    // 🔹 Cleanup à la destruction du composant
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px" }}>
      <h1>Créer mon livre personnalisé</h1>
      <p>Glisse-dépose des photos de l’enfant pour démarrer.</p>

      <Dropzone />

      {childId && (
        <div style={{ marginTop: 24 }}>
          🔄 Écoute des updates Supabase pour {childId}...
          <button
            onClick={async () => {
              const { data, error } = await supabase
                .from("uploads")
                .update({ status: "done" })
                .eq("childId", childId);
              console.log({ data, error });
            }}
            style={{ marginLeft: 16 }}
          >
            TEST update status
          </button>
        </div>
      )}
    </main>
  );
}
