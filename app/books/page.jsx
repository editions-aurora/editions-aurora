import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ⚡ Nouveau modèle App Router → les props incluent searchParams
export default async function BooksPage({ searchParams }) {
  const childId = searchParams?.childId;

  if (!childId) {
    return <p>Pas de données (aucun childId fourni)</p>;
  }

  // On va chercher les données dans Supabase côté serveur
  const { data: child, error } = await supabase
    .from('children_photos')
    .select('*')
    .eq('id', childId)
    .single();

  if (error || !child) {
    console.error(error);
    return <p>Erreur ou aucune donnée trouvée pour childId={childId}</p>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Caractéristiques de l'enfant</h1>
      <p>Sexe : {child.sexe}</p>
      <p>Âge : {child.age}</p>
      <p>Origine : {child.origin}</p>
      <p>Cheveux : {child.hair_color} / {child.hair_type} / {child.hair_size}</p>
      <p>Yeux : {child.eyes}</p>
      <p>Lunettes : {child.glasses ? 'Oui' : 'Non'}</p>
      <p>Taches de rousseur : {child.freckles ? 'Oui' : 'Non'}</p>
      <p><b>Child_ID : {child.child_ID}</b></p>
    </div>
  );
}
