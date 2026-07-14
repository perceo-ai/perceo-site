import { redirect } from "next/navigation";
import { linuxConductor } from "../../data/products";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `${linuxConductor.name} | Linux-native Conductor workspaces`,
  description: linuxConductor.subhead,
};

export default function ArchductorPage() {
  redirect(siteConfig.products.find((product) => product.slug === "archductor")?.href ?? "/products#archductor");
}
