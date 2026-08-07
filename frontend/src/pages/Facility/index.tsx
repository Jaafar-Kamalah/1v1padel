import { useParams } from "react-router-dom";

function Facility() {
  const { id } = useParams();

  return (
    <>
      <h1>Facility {id}</h1>
    </>
  );
}

export default Facility;
