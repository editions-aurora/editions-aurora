export default function ChildPage({ params }) {
  console.log("PARAMS:", params);
  return <div>PARAMS: {JSON.stringify(params)}</div>;
}