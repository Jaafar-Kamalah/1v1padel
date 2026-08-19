import FacilityCard from "./FacilityCard";
import supabase from "../../lib/supabase";
import { useEffect, useState } from "react";
import type { Database } from "../../../../supabase/types"
import "./index.css";

type Facility = Database["public"]["Tables"]["facilities"]["Row"];

function Facilities() {
  const myFacilities = [
    {
      imageUrl:
        "https://assets.matchi.se/archive/2022/03/thumb_ae073ee112b48cbd025a020a1d9774fc.jpg",
      name: "Nordic Wellness Linköping Tornby Padel",
      id: 1,
    },
  ];

  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  // Load facilites once after mount
  useEffect(() => {
    async function loadFacilities() {
      const { data, error } = await supabase.from("facilities").select("*");

      if (error) {
        console.error("Error fetching facilities: ", error);
      } else {
        setAllFacilities(data);
      }
      setLoading(false);
    }

    loadFacilities(); // useEffect can't take loadFacilities directly because it is async
  }, []);

  if (loading) {
    return <p>Loading facilities...</p>;
  }

  return (
    <div className="home">
      <div className="fac-grid-container">
        <h1>My Facilities</h1>
        <div className="fac-grid">
          {myFacilities.map((f) => (
            <FacilityCard
              imageUrl={f.imageUrl}
              name={f.name}
              id={f.id}
              key={f.id}
            />
          ))}
        </div>
      </div>

      <div className="fac-grid-container">
        <h1>All Facilities</h1>
        <div className="fac-grid">
          {allFacilities.map((f) => (
            <FacilityCard
              imageUrl={f.image_url}
              name={f.name}
              id={f.id}
              key={f.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Facilities;
