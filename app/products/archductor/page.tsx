import { redirect } from "next/navigation";
import { linuxConductor } from "../../data/products";

export const metadata = {
  title: "Archductor | Linux-native Conductor workspaces",
  description: linuxConductor.subhead,
};

export default function ArchductorPage() {
  redirect("/products#archductor");
}
