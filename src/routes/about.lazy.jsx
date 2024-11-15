import { createLazyFileRoute, useRouteContext } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const context = useRouteContext({ from: "/about" });
  console.log(context);

  return <div>Hello from About!</div>;
}
