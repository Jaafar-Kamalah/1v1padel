import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Database } from "../../../../supabase/types";
import supabase from "../../lib/supabase";

type Facility = Database["public"]["Tables"]["facilities"]["Row"];

function Facility() {
  const { facilityId } = useParams();

  const [facilityLoading, setFacilityLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [facility, setFacility] = useState<Facility | null>(null);

  useEffect(() => {
    async function loadFacility() {
      setFacilityLoading(true);
      if (!facilityId) {
        setFacilityLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("id", facilityId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching facility: ", error);
      } else {
        setFacility(data);
      }
      setFacilityLoading(false);
    }

    loadFacility();
  }, [facilityId]);

  if (facilityLoading || leaderboardLoading) {
    return <p>Loading page...</p>;
  } else if (!facilityLoading && !facility) {
    return <p>Facility not found.</p>;
  }

  return (
    <div className="facility-page">
      <h1>{facility?.name}</h1>
    </div>
  );
}

export default Facility;
