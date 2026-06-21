import { redirect } from "next/navigation";

export const metadata = {
  title: "Archductor Docs",
  description: "Install, verify, build, and test Archductor for Linux.",
};

export default function DocsPage() {
  redirect("/docs/archductor");
}
