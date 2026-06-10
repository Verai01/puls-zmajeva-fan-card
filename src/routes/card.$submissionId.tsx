import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toPng, toBlob } from "html-to-image";
import { ArrowLeft, Download, BarChart3, Share2 } from "lucide-react";
import { submissionQuery, matchQuery } from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader } from "@/components/BrandHeader";
import { PulsCard, type PulsCardData } from "@/components/PulsCard";
import { countryByName, flagUrl } from "@/lib/data/countries";
import { toast } from "sonner";

export const Route = createFileRoute("/card/$submissionId")({
  head: () => ({ meta: [{ title: "Tvoja BiH Puls Card · Puls Zmajeva" }] }),
  loader: async ({ context, params }) => {
    const sub = await context.queryClient.ensureQueryData(
      submissionQuery(params.submissionId),
    );
    await context.queryClient.ensureQueryData(matchQuery(sub.match_id));
  },
  component: CardPage,
  errorComponent: () => (
    <AppShell>
      <BrandHeader />
      <div className="p-6 text-center text-foreground">
        Card nije pronađena.{" "}
        <Link to="/" className="text-primary underline">
          Nazad
        </Link>
      </div>
    </AppShell>
  ),
});

const EXPORT_OPTS = {
  pixelRatio: 1,
  width: 1080,
  height: 1920,
  cacheBust: true,
} as const;

function CardPage() {
  const { submissionId } = Route.useParams();
  const { data: sub } = useSuspenseQuery(submissionQuery(submissionId));
  const { data: match } = useSuspenseQuery(matchQuery(sub.match_id));
  const exportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"none" | "download" | "share">("none");

  const country = countryByName(sub.country);
  const cardData: PulsCardData = {
    name: sub.name,
    cityDisplay: sub.city_display,
    countryFlag: country?.flag ?? "🌍",
    countryFlagUrl: flagUrl(country?.code),
    countryName: sub.country,
    opponentName: match.opponent_name,
    bihScore: sub.bih_score,
    opponentScore: sub.opponent_score,
    pulsValue: sub.puls_value,
    pulsLabel: sub.puls_label,
  };

  const fileName = `bih-puls-card-${sub.name.toLowerCase().replace(/\s+/g, "-")}.png`;

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setBusy("download");
    try {
      const dataUrl = await toPng(exportRef.current, EXPORT_OPTS);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("Greška pri preuzimanju. Pokušaj ponovo.");
    } finally {
      setBusy("none");
    }
  };

  const handleShare = async () => {
    if (!exportRef.current) return;
    setBusy("share");
    try {
      const blob = await toBlob(exportRef.current, EXPORT_OPTS);
      const file = blob
        ? new File([blob], fileName, { type: "image/png" })
        : null;
      const nav = navigator as Navigator & {
        canShare?: (d: ShareData) => boolean;
      };
      if (file && nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "Puls Zmajeva",
          text: "Moja BiH Puls Card 🐉 #DREAMBIH",
        });
      } else {
        toast("Preuzmi kartu i objavi je na Instagram Story.");
        await handleDownload();
      }
    } catch {
      /* user cancelled share — no error toast */
    } finally {
      setBusy("none");
    }
  };

  return (
    <AppShell>
      <BrandHeader />
      <main className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-5 pb-16 pt-4">
        <Link to="/" className="flex w-full items-center gap-1 text-sm font-bold text-ice">
          <ArrowLeft className="h-4 w-4" /> Početna
        </Link>

        <h2 className="text-center font-display text-2xl uppercase tracking-wide text-primary">
          ★ Tvoja Puls Card je spremna ★
        </h2>

        <div className="w-full max-w-[300px]">
          <PulsCard data={cardData} />
        </div>

        <button
          onClick={handleDownload}
          disabled={busy !== "none"}
          className="inline-flex w-full max-w-[340px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-lg uppercase tracking-wide text-primary-foreground gold-glow disabled:opacity-50"
        >
          <Download className="h-5 w-5" strokeWidth={3} />
          {busy === "download" ? "Pripremam…" : "Download Card"}
        </button>

        <button
          onClick={handleShare}
          disabled={busy !== "none"}
          className="inline-flex w-full max-w-[340px] items-center justify-center gap-2 rounded-full border-2 border-primary/70 bg-primary/10 px-6 py-3.5 font-display text-base uppercase tracking-wide text-primary disabled:opacity-50"
        >
          <Share2 className="h-5 w-5" strokeWidth={2.5} />
          {busy === "share" ? "Pripremam…" : "Podijeli na Instagram"}
        </button>

        <Link
          to="/match/$id"
          params={{ id: match.id }}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ice underline underline-offset-4"
        >
          <BarChart3 className="h-4 w-4" /> Pogledaj live rezultate
        </Link>

        {/* hidden high-res render for export (1080x1920) */}
        <div
          aria-hidden
          style={{ position: "fixed", top: 0, left: -9999, width: 1080 }}
        >
          <PulsCard ref={exportRef} data={cardData} />
        </div>
      </main>
    </AppShell>
  );
}
