import FacilityCard from "./FacilityCard"
import "./index.css"

function Facilities() {
  return (
    <div className="home">
      <div className="fac-grid-container">
        <h1>My Facilities</h1>
        <div className="fac-grid">
          <FacilityCard key="a" />
        </div>
      </div>

      <div className="fac-grid-container">
        <h1>All Facilities</h1>
        <div className="fac-grid">
          <FacilityCard key="a" />
          <FacilityCard key="a" />
          <FacilityCard key="a" />
        </div>
      </div>
    </div>
  );
}

export default Facilities;
