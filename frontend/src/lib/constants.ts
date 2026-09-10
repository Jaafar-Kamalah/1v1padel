// TODO: maybe use enum in db and get status types from types.ts to make this typesafe
export const STATUS_COLOR: Record<string, string> = {
  pending: "orange",
  accepted: "green",
  denied: "gray",
  completed: "gray",
};
