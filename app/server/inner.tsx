"use client";

import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.myFunctions.getUserInfo>;
}) {
  const data = usePreloadedQuery(preloaded);
  const getStats = useQuery(api.myFunctions.getStats);
  return (
    <>
      <div className="flex flex-col gap-4 bg-muted p-4 rounded-md">
        <h2 className="text-xl font-bold">User Info</h2>
        <code>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </code>
      </div>
      <div className="flex flex-col gap-4 bg-muted p-4 rounded-md">
        <h2 className="text-xl font-bold">Stats</h2>
        <code>
          <pre>{JSON.stringify(getStats, null, 2)}</pre>
        </code>
      </div>
    </>
  );
}
