import Link from "next/link";
import Navbar from "../components/Navbar";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_callback:
    "Invalid or missing installation data. Please run perceo init again and use the install link from the CLI.",
  no_key:
    "No API key found for this project. Make sure you've run perceo init and have a github-actions key set up.",
  github_error:
    "We couldn't set the repository secret. The GitHub App may lack access or permissions.",
};

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ?? null;
  const message = error ? (ERROR_MESSAGES[error] || "Something went wrong.") : null;

  return (
    <div className="min-h-screen bg-[#312F2F] relative">
      <Navbar />
      <main className="pt-32 px-5 md:px-12.5 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-card p-8 md:p-10">
          <h1 className="font-serif text-2xl md:text-3xl text-white mb-4">
            {error ? "Setup issue" : "Setup"}
          </h1>
          {message && (
            <p className="text-white/80 mb-6">{message}</p>
          )}
          {!error && (
            <p className="text-white/80 mb-6">
              If you were redirected here after installing the GitHub App, something may have gone wrong. Check the URL for an <code className="text-green-400">error</code> parameter.
            </p>
          )}
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
