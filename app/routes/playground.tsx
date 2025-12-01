import type { Route } from "./+types/playground";
import { requireAuth } from "~/utils/requireAuth.server";

export const meta = (_args: Route.MetaArgs) => {
  return [
    { title: "Playground - Campex" },
    { name: "description", content: "A playground route for testing and experimentation." }
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const { user } = await requireAuth(request);
  // This loader currently does not fetch any data
  // console.log("Authenticated user in playground:", user);
  return { user };
}

export default function Playground({loaderData}: Route.ComponentProps) {

    const user = loaderData?.user;
  return (
    <div>
      <h1>Playground</h1>
      <p>This is a playground route for testing and experimentation.</p>
      <p> Here's the user logged in - {user?.user_metadata.username} </p>
    </div>
  );
}