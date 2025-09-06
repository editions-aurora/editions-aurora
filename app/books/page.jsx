import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getServerSideProps(context) {
  const { childId } = context.query;

  if (!childId) {
    return { props: { child: null } };
  }

  const { data, error } = await supabase
    .from('children_photos')
    .select('*')
    .eq('id', childId)
    .single();

  if (error) {
    console.error(error);
    return { props: { child: null } };
  }

  return { props: { child: data } };
}

export default function BooksPage({ child }) {
  if (!child) return <p>Pas de données</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Caractéristiques de l'enfant</h1>
      <p>Sexe : {child.sexe}</p>
      <p>Age : {child.age}</p>
      <p>Origine : {child.origin}</p>
      <p>Cheveux : {child.hair_color} / {child.hair_type} / {child.hair_size}</p>
      <p>Yeux : {child.eyes}</p>
      <p>Lunettes : {child.glasses ? 'Oui' : 'Non'}</p>
      <p>Taches de rousseur : {child.freckles ? 'Oui' : 'Non'}</p>
    </div>
  );
}
