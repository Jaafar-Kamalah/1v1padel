import "./FacilityCard.css"

function FacilityCard() {
  return (
    <div className="fac-card">
      <div className="fac-poster">
        <img
          src="https://assets.matchi.se/archive/2022/03/thumb_ae073ee112b48cbd025a020a1d9774fc.jpg"
          alt="Nordic Wellness Padel poster"
        />
        <div className="fac-overlay"></div>
      </div>
      <div className="fac-name">
        <h3>Nordic Wellness Linköping Tornby Padel</h3>
      </div>
      <button className="favorite-btn" onClick={() => alert("click")}></button>
    </div>
  );
}

export default FacilityCard;
