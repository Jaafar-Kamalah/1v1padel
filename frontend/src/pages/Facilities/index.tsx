import FacilityCard from "./FacilityCard";
import supabase from "../../lib/supabase";
import { useEffect, useState } from "react";
import type { Database } from "../../../../supabase/types";
import "./index.css";
import { useAuthContext } from "../../contexts/AuthContext";

type Facility = Database["public"]["Tables"]["facilities"]["Row"];

function Facilities() {
  // TODO: Implement loading myFacilities after setting up auth
  const [myFacilities, setMyFacilities] = useState<Facility[]>([]);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuthContext();

  // Load facilites once after mount
  useEffect(() => {
    async function loadFacilities() {
      const userId = session?.user?.id;

      const allFacilitiesPromise = supabase.from("facilities").select("*");

      // Request joined facilities if session is valid
      const myFacilitiesPromise = userId
        ? supabase
            .from("memberships")
            .select("facilities(*)")
            .eq("user_id", userId)
        : Promise.resolve({ data: [], error: null });

      const [allFacilitiesResult, myFacilitiesResult] = await Promise.all([
        allFacilitiesPromise,
        myFacilitiesPromise,
      ]);

      if (allFacilitiesResult.error) {
        console.error("Error fetching facilities: ", allFacilitiesResult.error);
      } else {
        setAllFacilities(allFacilitiesResult.data);
      }

      if (myFacilitiesResult.error) {
        console.error("Error fetching facilities: ", myFacilitiesResult.error);
      } else {
        const myFacilitiesData = myFacilitiesResult.data ?? [];
        // Convert from [{facilities: {...}}, {facilities: {...}} to [{...}, {...}]
        setMyFacilities(
          myFacilitiesData.map((row: any) => row.facilities).filter(Boolean),
        );
      }
      setLoading(false);
    }

    loadFacilities(); // useEffect can't take loadFacilities directly because it is async
  }, []);

  if (loading) {
    return <p>Loading facilities...</p>;
  }

  return (
    <div className="home-page">
      <div className="fac-grid-container">
        <h1>My Facilities</h1>
        <div className="fac-grid">
          {myFacilities.map((f) => (
            <FacilityCard
              imageUrl={f.image_url}
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
