import Link from "next/link";
import Navbar from "../../components/Navbar";

export default async function SetupCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ repo?: string }>;
}) {
  const params = await searchParams;
  const repo = params.repo ?? "your repository";

  return (
    <div className="min-h-screen bg-[#312F2F] relative">
      <Navbar />
      <main className="pt-32 px-5 md:px-12.5 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-card p-8 md:p-10">
          <h1 className="font-serif text-2xl md:text-3xl text-white mb-4">
            Repository connected
          </h1>
          <p className="text-white/80 mb-6">
            <strong className="text-white">{repo}</strong> is now connected to Perceo. The{" "}
            <code className="text-green-400">PERCEO_API_KEY</code> secret has been set in GitHub
            Actions, so you can run your workflows without any extra setup.
          </p>
          <Link
            href="/"
            className="inline-block text-green-400 hover:text-green-300 font-medium"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
