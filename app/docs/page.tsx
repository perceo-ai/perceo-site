import { redirect } from "next/navigation";

export const metadata = {
  title: "Product Docs",
  description: "Product docs for Archductor and future Perceo products.",
};

export default function DocsPage() {
  redirect("/docs/archductor");
}
