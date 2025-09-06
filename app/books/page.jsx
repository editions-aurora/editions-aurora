// app/books/[childId]/page.jsx
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Mapping des childId vers les images
const childImages = {
  G1: "/images/child1.png",
  G2: "/images/child2.png",
  G3: "/images/child3.png",
  // ...
  G14: "/images/child14.png",
};

export default async function ChildPage({ params }) {
  const { childId } = params;

  // Récupération des infos depuis Supabase
  const { data: child, error } = await supabase
    .from("children_photos")
    .select("*")
    .eq("id", childId)
    .single();

  if (error || !child) {
    return <p>Erreur : aucune donnée trouvée pour childId={childId}</p>;
  }

  const imageSrc = childImages[childId] || "/images/default.png";

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Caractéristiques de l'enfant</h1>
      <Image src={imageSrc} alt="Enfant" width={200} height={200} />
      <p>Sexe : {child.sexe}</p>
      <p>Âge : {child.age}</p>
      <p>Origine : {child.origin}</p>
      <p>
        Cheveux : {child.hair_color} / {child.hair_type} / {child.hair_size}
      </p>
      <p>Yeux : {child.eyes}</p>
      <p>Lunettes : {child.glasses ? "Oui" : "Non"}</p>
      <p>Taches de rousseur : {child.freckles ? "Oui" : "Non"}</p>
    </div>
  );
}
