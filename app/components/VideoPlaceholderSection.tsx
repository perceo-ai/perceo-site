import { siteConfig } from "@/lib/site-config";

export default function VideoPlaceholderSection() {
  const { video } = siteConfig.homePage;

  return (
    <section className="relative z-[15] mx-5 border-t border-white/5 py-16 md:mx-12.5 md:py-24">
      <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
        <div>
          <h2 className="font-serif text-3xl font-bold italic text-white md:text-5xl">
            {video.headline}
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-zinc-400">
            {video.description}
          </p>
        </div>
        <div className="glass min-w-0 overflow-hidden rounded-lg p-3">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-zinc-500">
            <span>{video.label}</span>
            <span>{video.meta}</span>
          </div>
          <div className="flex aspect-[16/10] min-h-[260px] items-center justify-center rounded-md bg-black/30 p-6 text-center text-sm text-zinc-500 md:min-h-0">
            {video.placeholder}
          </div>
        </div>
      </div>
    </section>
  );
}
