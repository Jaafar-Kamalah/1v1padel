import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Database } from "../../../../supabase/types";
import supabase from "../../lib/supabase";

type Facility = Database["public"]["Tables"]["facilities"]["Row"];
type LeaderboardEntry =
  Database["public"]["Views"]["facility_leaderboard"]["Row"];

function Facility() {
  const { facilityId } = useParams();

  const [facilityLoading, setFacilityLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

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

  useEffect(() => {
    async function loadLeaderboard() {
      setLeaderboardLoading(true);
      if (!facilityId) {
        setLeaderboardLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("facility_leaderboard")
        .select("*")
        .eq("facility_id", facilityId);

      if (error) {
        console.error("Error fetching leaderboard: ", error);
      } else {
        setLeaderboard(data);
      }
      setLeaderboardLoading(false);
    }

    loadLeaderboard();
  }, [facilityId]);

  if (facilityLoading || leaderboardLoading) {
    return <p>Loading page...</p>;
  } else if (!facilityLoading && !facility) {
    return <p>Facility not found.</p>;
  }

  return (
    <div className="facility-page">
      <h1>{facility?.name}</h1>
      {leaderboard.map((l) => (
        <p key={l.user_id}>{l.first_name}</p>
      ))}
    </div>
  );
}

export default Facility;
