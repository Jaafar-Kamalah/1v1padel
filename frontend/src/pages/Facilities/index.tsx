import FacilityCard from "./FacilityCard";
import "./index.css";

function Facilities() {
  const myFacilities = [
    {
      imageUrl:
        "https://assets.matchi.se/archive/2022/03/thumb_ae073ee112b48cbd025a020a1d9774fc.jpg",
      name: "Nordic Wellness Linköping Tornby Padel",
      id: 1
    },
  ];

  const allFacilities = [
    ...myFacilities,
    {
      imageUrl:
        "https://assets.matchi.se/archive/2023/04/thumb_f448d8b5ead524f9b857174c2e2d4ebd.jpg",
      name: "Alfa Padel & Co",
      id: 2
    },
  ];

  return (
    <div className="home">
      <div className="fac-grid-container">
        <h1>My Facilities</h1>
        <div className="fac-grid">
          {myFacilities.map((f) => (
            <FacilityCard imageUrl={f.imageUrl} name={f.name} id={f.id} key={f.id} />
          ))}
        </div>
      </div>

      <div className="fac-grid-container">
        <h1>All Facilities</h1>
        <div className="fac-grid">
          {allFacilities.map((f) => (
            <FacilityCard imageUrl={f.imageUrl} name={f.name} id={f.id} key={f.id}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Facilities;
