import { useState } from "react";
import { Copy, Check, Search, ExternalLink, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PLATFORMS = [
  {
    id: "weidian",
    name: "Weidian",
    label: "Oryginał",
    color: "from-orange-500 to-red-500",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    buildUrl: (id: string) => `https://weidian.com/item.html?itemID=${id}`,
  },
  {
    id: "kakobuy",
    name: "Kakobuy",
    label: "Agent",
    color: "from-blue-500 to-cyan-500",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    buildUrl: (id: string) =>
      `https://www.kakobuy.com/item/details?url=${encodeURIComponent(`https://weidian.com/item.html?itemID=${id}`)}`,
  },
  {
    id: "cnfans",
    name: "CNFans",
    label: "Agent",
    color: "from-purple-500 to-violet-500",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    buildUrl: (id: string) => `https://cnfans.com/product?id=${id}&platform=WEIDIAN`,
  },
  {
    id: "usfans",
    name: "USFans",
    label: "Agent",
    color: "from-green-500 to-emerald-500",
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
    buildUrl: (id: string) => `https://usfans.com/product/3/${id}`,
  },
];

function extractWeidianId(raw: string): { id: string | null; source: string } {
  const input = raw.trim();
  const encodedUrlMatch = input.match(/[?&]url=([^&\s]+)/i);
  if (encodedUrlMatch) {
    try {
      const decoded = decodeURIComponent(encodedUrlMatch[1]);
      const inner = extractWeidianId(decoded);
      if (inner.id) return { id: inner.id, source: "Kakobuy" };
    } catch {}
  }
  const weidianMatch = input.match(/[?&]itemID=(\d+)/i);
  if (weidianMatch) return { id: weidianMatch[1], source: "Weidian" };
  if (input.toLowerCase().includes("cnfans.com")) {
    const cnfansId = input.match(/[?&]id=(\d+)/i);
    if (cnfansId) return { id: cnfansId[1], source: "CNFans" };
  }
  const usfansMatch = input.match(/\/product\/\d+\/(\d{7,})/i);
  if (usfansMatch) return { id: usfansMatch[1], source: "USFans" };
  const genericId = input.match(/[?&]id=(\d{7,})/i);
  if (genericId) return { id: genericId[1], source: "Unknown" };
  const allNums = [...input.matchAll(/\b(\d{8,})\b/g)].map((m) => m[1]);
  if (allNums.length > 0) {
    const longest = allNums.reduce((a, b) => (b.length > a.length ? b : a));
    return { id: longest, source: "Unknown" };
  }
  return { id: null, source: "" };
}

function detectInputPlatform(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("kakobuy.com")) return "Kakobuy";
  if (u.includes("cnfans.com")) return "CNFans";
  if (u.includes("usfans.com")) return "USFans";
  if (u.includes("weidian.com")) return "Weidian";
  return "Nieznana";
}

const Konwerter = () => {
  const [input, setInput] = useState("");
  const [productId, setProductId] = useState<string | null>(null);
  const [detectedFrom, setDetectedFrom] = useState<string | null>(null);
  const [results, setResults] = useState<{ name: string; url: string; platform: (typeof PLATFORMS)[0] }[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleConvert = () => {
    setError("");
    setResults([]);
    setProductId(null);
    setDetectedFrom(null);

    if (!input.trim()) {
      setError("Wklej link do produktu.");
      return;
    }

    const { id, source } = extractWeidianId(input);
    if (!id) {
      setError("Nie udało się wyodrębnić ID produktu. Upewnij się, że link pochodzi z Weidian, Kakobuy, CNFans lub USFans.");
      return;
    }

    const platform = detectInputPlatform(input) || source;
    setProductId(id);
    setDetectedFrom(platform);

    setResults(
      PLATFORMS.filter((p) => p.name.toLowerCase() !== platform.toLowerCase()).map((p) => ({
        name: p.name,
        url: p.buildUrl(id),
        platform: p,
      }))
    );
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Konwerter linków</h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Wklej link z dowolnej platformy — wygenerujemy linki do wszystkich agentów automatycznie.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {PLATFORMS.map((p) => (
              <span
                key={p.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${p.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${p.color}`} />
                {p.name}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 md:p-8 space-y-4 shadow-xl shadow-black/20">
            <label className="text-sm font-semibold text-foreground">Link produktu</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="https://weidian.com / kakobuy.com / cnfans.com / usfans.com"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                  className="pl-9 bg-background/70 border-border/60 focus:border-primary h-11 text-sm"
                />
              </div>
              <Button
                onClick={handleConvert}
                disabled={!input.trim()}
                className="h-11 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-md border-0"
              >
                Konwertuj
              </Button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  Wykryto:
                  <span className="font-semibold text-foreground">{detectedFrom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">ID produktu:</span>
                  <code className="font-mono text-xs font-bold bg-muted px-2 py-0.5 rounded text-foreground">
                    {productId}
                  </code>
                  <button
                    onClick={() => handleCopy(productId!, "id")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Kopiuj ID"
                  >
                    {copied === "id" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {results.map((r) => (
                  <div
                    key={r.platform.id}
                    className="rounded-xl border border-border bg-card/60 backdrop-blur p-4 hover:border-border/80 hover:bg-card transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${r.platform.color}`} />
                        <span className="font-semibold text-sm text-foreground">{r.platform.name}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${r.platform.badge}`}>
                          {r.platform.label}
                        </span>
                      </div>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Otwórz</span>
                      </a>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="flex-1 min-w-0 bg-background/70 border border-border/50 rounded-lg px-3 py-2 overflow-hidden">
                        <p className="text-xs font-mono text-muted-foreground truncate">{r.url}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 h-9 w-9 border-border/60 hover:bg-muted"
                        onClick={() => handleCopy(r.url, r.platform.id)}
                        title="Kopiuj link"
                      >
                        {copied === r.platform.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.length === 0 && !error && (
            <div className="rounded-2xl border border-border/40 bg-card/30 p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Jak to działa?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { step: "1", title: "Wklej link", desc: "Z Weidian, Kakobuy, CNFans lub USFans" },
                  { step: "2", title: "Ekstrakcja ID", desc: "Wyodrębniamy Weidian itemID z każdego formatu" },
                  { step: "3", title: "Gotowe linki", desc: "Generujemy linki do wszystkich platform jednocześnie" },
                ].map((s) => (
                  <div key={s.step} className="flex gap-3">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Konwerter;
