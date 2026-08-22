import type { ReactNode } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

function PublicRoute({ children }: Props) {
  const { session } = useAuthContext();
  if (session === undefined) {
    return <p>Loading page...</p>;
  }

  return !session ? children : <Navigate to="/" />;
}

export default PublicRoute;
