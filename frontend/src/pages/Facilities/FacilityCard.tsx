import "./FacilityCard.css"

interface Props{
  imageUrl: string;
  name: string;
}

function FacilityCard({imageUrl, name}: Props) {  
  return (
    <div className="fac-card">
      <div className="fac-poster">
        <img
          src={imageUrl}
          alt={name + " poster"}
        />
        <div className="fac-overlay"></div>
      </div>
      <div className="fac-name">
        <h4>{name}</h4>
      </div>
      <button className="fac-btn" onClick={() => alert("click")}></button>
    </div>
  );
}

export default FacilityCard;
