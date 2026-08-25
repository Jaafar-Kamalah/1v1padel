import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Database } from "../../../../supabase/types";
import supabase from "../../lib/supabase";
import { useAuthContext } from "../../contexts/AuthContext";
import "./index.css";

type Facility = Database["public"]["Tables"]["facilities"]["Row"];
type LeaderboardEntry =
  Database["public"]["Views"]["facility_leaderboard"]["Row"];

function Facility() {
  const { session } = useAuthContext();
  const userId = session?.user?.id;
  const { facilityId } = useParams();

  const [facilityLoading, setFacilityLoading] = useState(true);
  const [facility, setFacility] = useState<Facility | null>(null);

  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [membershipActionLoading, setMembershipActionLoading] = useState(false);

  // Load facility
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

  // Load leaderboard
  async function loadLeaderboard() {
    setLeaderboardLoading(true);
    // facility_leaderboard requires a facilityId and session token to access
    if (!facilityId || !userId) {
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

  useEffect(() => {
    loadLeaderboard();
  }, [facilityId, userId]);

  // Live update leaderboard when a membership is inserted or deleted
  useEffect(() => {
    if (!facilityId || !userId) return;

    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memberships",
          filter: `facility_id=eq.${facilityId}`,
        },
        () => {
          loadLeaderboard();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [facilityId, userId]);

  // Render loading or not found state
  if (facilityLoading || leaderboardLoading) {
    return <p>Loading page...</p>;
  } else if (!facilityLoading && !facility) {
    return <p>Facility not found.</p>;
  }

  // Toggling button to handle "Join Facility" and "Leave Facility"
  async function joinFacility() {
    if (!facilityId || !userId || membershipActionLoading) return;

    setMembershipActionLoading(true);
    const { error } = await supabase
      .from("memberships")
      .insert({ facility_id: facilityId, user_id: userId });

    if (error) {
      console.error("Error joining facility: ", error);
    }
    setMembershipActionLoading(false);
  }

  async function leaveFacility() {
    if (!facilityId || !userId || membershipActionLoading) return;

    setMembershipActionLoading(true);
    const { error } = await supabase
      .from("memberships")
      .delete()
      .eq("facility_id", facilityId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error leaving facility: ", error);
    }
    setMembershipActionLoading(false);
  }

  const joinedEntry = leaderboard.find((l) => l.user_id === userId);
  function MembershipButton() {
    if (leaderboardLoading) {
      return <button disabled>Loading…</button>;
    }
    if (joinedEntry) {
      return <button className="leave-btn" onClick={leaveFacility}>Leave</button>;
    }
    return <button className="join-btn" onClick={joinFacility}>Join</button>;
  }

  return (
    <div className="facility-page">
      <div className="card">
        <header className="header">
          <div className="header-text">
            <h1>{facility?.name}</h1>
            <div className="address">
              <span>{facility?.address}</span>
            </div>
          </div>
          {MembershipButton()}
        </header>

        <div>
          <h2>Leaderboard</h2>
          <span>{leaderboard.length} members</span>
        </div>

        <div>
          {leaderboard.map((l) => (
            <p key={l.user_id}>{l.first_name}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Facility;
