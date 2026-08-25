import FacilityCard from "./FacilityCard";
import supabase from "../../lib/supabase";
import { useEffect, useState } from "react";
import type { Database } from "../../../../supabase/types";
import "./index.css";
import { useAuthContext } from "../../contexts/AuthContext";

type Facility = Database["public"]["Tables"]["facilities"]["Row"];

function Facilities() {
  const [myFacilities, setMyFacilities] = useState<Facility[]>([]);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [myFacilitiesLoading, setMyFacilitiesLoading] = useState(true);
  const [allFacilitiesLoading, setAllFacilitiesLoading] = useState(true);
  const { session } = useAuthContext();
  const userId = session?.user?.id;

  async function loadMyFacilities() {
    if (!userId) {
      setMyFacilities([]);
      setMyFacilitiesLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("memberships")
      .select("facilities(*)")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching my facilities: ", error);
    } else {
      const myFacilitiesData = data ?? [];
      // Convert from [{facilities: {...}}, {facilities: {...}} to [{...}, {...}]
      setMyFacilities(
        myFacilitiesData.map((row: any) => row.facilities).filter(Boolean),
      );
    }
    setMyFacilitiesLoading(false);
  }

  useEffect(() => {
    async function loadAllFacilities() {
      const { data, error } = await supabase.from("facilities").select("*");

      if (error) {
        console.error("Error fetching all facilities: ", error);
      } else {
        setAllFacilities(data);
      }
      setAllFacilitiesLoading(false);
    }
    loadAllFacilities();
  }, []);

  useEffect(() => {
    loadMyFacilities();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("myFacilitiesMembership")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memberships",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          loadMyFacilities();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (allFacilitiesLoading || myFacilitiesLoading) {
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
