import { Link } from "react-router-dom";
import "./FacilityCard.css";

interface Props {
  imageUrl: string;
  name: string;
  id: number;
}

function FacilityCard({ imageUrl, name, id }: Props) {
  return (
    <Link to={"/facility/" + id} className="fac-card">
      <div className="fac-poster">
        <img src={imageUrl} alt={name + " logo"} loading="lazy" />
        <div className="fac-overlay"></div>
      </div>
      <div className="fac-name">
        <h4 className="gb-ellipsis">{name}</h4>
      </div>
    </Link>
  );
}

export default FacilityCard;
