import { redirect } from "next/navigation";

export const metadata = {
  title: "Perceo Suite Docs",
  description: "Product documentation for the Perceo Suite.",
};

export default function DocsPage() {
  redirect("/docs/archivum");
}
