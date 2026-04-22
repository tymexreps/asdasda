import { useState, useRef } from "react";
import { Shield, LogOut, Plus, Trash2, Package, ImagePlus, X, Link2, Zap, Star, Images, Crown, Wallet, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts, Product, Batch } from "@/context/products-context";

const ADMIN_PASSWORD = "admin123";
const categories = ["Buty", "Bluzy", "Koszulki", "Spodnie", "Akcesoria", "Inne"] as const;

function extractWeidianId(raw: string): string | null {
  const input = raw.trim();
  const enc = input.match(/[?&]url=([^&\s]+)/i);
  if (enc) {
    try {
      const d = extractWeidianId(decodeURIComponent(enc[1]));
      if (d) return d;
    } catch {}
  }
  const wi = input.match(/[?&]itemID=(\d+)/i);
  if (wi) return wi[1];
  if (input.toLowerCase().includes("cnfans.com")) {
    const m = input.match(/[?&]id=(\d+)/i);
    if (m) return m[1];
  }
  const uf = input.match(/\/product\/\d+\/(\d{7,})/i);
  if (uf) return uf[1];
  const gi = input.match(/[?&]id=(\d{7,})/i);
  if (gi) return gi[1];
  const nums = [...input.matchAll(/\b(\d{8,})\b/g)].map((m) => m[1]);
  if (nums.length) return nums.reduce((a, b) => (b.length > a.length ? b : a));
  return null;
}

async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const s = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * s);
    height = Math.round(height * s);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

function ImageDropZone({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const readFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const r = e.target?.result as string;
        if (r) onChange(r);
      };
      reader.readAsDataURL(file);
    }
  };

  if (value) {
    return (
      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border bg-background group">
        <img src={value} alt="Podgląd" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
        >
          <X className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
        ${dragging ? "border-primary bg-primary/10" : "border-border bg-background/70 hover:border-primary/60"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) readFile(f);
      }}
      onClick={() => ref.current?.click()}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) readFile(f);
        }}
      />
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <ImagePlus className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center px-4">
        <p className="text-sm font-medium text-foreground">Przeciągnij zdjęcie</p>
        <p className="text-xs text-muted-foreground mt-1">lub kliknij aby wybrać</p>
      </div>
    </div>
  );
}

function QCImagesZone({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const readFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const compressed: string[] = [];
    for (const file of arr) {
      try {
        compressed.push(await compressImage(file, 1400, 0.8));
      } catch {
        // skip on error
      }
    }
    if (compressed.length) onChange([...images, ...compressed]);
  };

  return (
    <div className="space-y-3">
      <div
        className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-6 cursor-pointer transition-colors
          ${dragging ? "border-primary bg-primary/10" : "border-border bg-background/70 hover:border-primary/60"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          readFiles(e.dataTransfer.files);
        }}
        onClick={() => ref.current?.click()}
      >
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) readFiles(e.target.files);
          }}
        />
        <Images className="h-7 w-7 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Dodaj zdjęcia QC</p>
        <p className="text-xs text-muted-foreground">Przeciągnij lub kliknij • wiele naraz</p>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
              <img src={src} alt={`qc-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Array.from({ length: 11 }, (_, i) => i).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-lg text-sm font-semibold border transition-colors
            ${
              value === n
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/70 text-muted-foreground border-border hover:border-primary/60"
            }`}
        >
          {n}
        </button>
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        <Star className="inline h-3 w-3 mb-0.5 mr-0.5" />
        {value}/10
      </span>
    </div>
  );
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [kakobuyLink, setKakobuyLink] = useState("");
  const [usfansLink, setUsfansLink] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Buty");
  const [rating, setRating] = useState(8);
  const [description, setDescription] = useState("");
  const [qcImages, setQcImages] = useState<string[]>([]);
  const [batch, setBatch] = useState<Batch>("best");

  const [quickInput, setQuickInput] = useState("");
  const [quickError, setQuickError] = useState("");
  const [quickSuccess, setQuickSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleGenerateDescription = async () => {
    setAiError("");
    if (!name.trim()) {
      setAiError("Najpierw wpisz nazwę produktu");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, extra: description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setDescription(data.description);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Błąd AI");
    } finally {
      setAiLoading(false);
    }
  };

  const { products, addProduct, removeProduct } = useProducts();

  const resetForm = () => {
    setName("");
    setPrice("");
    setImageUrl("");
    setKakobuyLink("");
    setUsfansLink("");
    setRating(8);
    setDescription("");
    setQcImages([]);
    setCategory("Buty");
    setBatch("best");
    setQuickInput("");
    setQuickError("");
    setQuickSuccess("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Nieprawidłowe hasło");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      await addProduct({ name, price, imageUrl, kakobuyLink, usfansLink, category, rating, description, qcImages, batch });
      resetForm();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Nie udało się dodać produktu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setQuickError("");
    setQuickSuccess("");
    const id = extractWeidianId(quickInput);
    if (!id) {
      setQuickError("Nie rozpoznano linku.");
      return;
    }
    setKakobuyLink(
      `https://www.kakobuy.com/item/details?url=${encodeURIComponent(`https://weidian.com/item.html?itemID=${id}`)}`
    );
    setUsfansLink(`https://usfans.com/product/3/${id}`);
    setQuickSuccess(`Wypełniono! ID produktu: ${id}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">Zaloguj się aby kontynuować</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
              {authError && <p className="text-sm text-destructive">{authError}</p>}
              <Button type="submit" className="w-full">
                Zaloguj się
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Zarządzaj produktami</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setPassword("");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Wyloguj
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold">Szybkie wypełnianie z linku</h2>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Wklej link Kakobuy / Weidian / CNFans / USFans…"
                  value={quickInput}
                  onChange={(e) => {
                    setQuickInput(e.target.value);
                    setQuickError("");
                    setQuickSuccess("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickFill()}
                  className="bg-background text-sm h-9"
                />
                <Button
                  type="button"
                  onClick={handleQuickFill}
                  disabled={!quickInput.trim()}
                  size="sm"
                  className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white border-0 shrink-0"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
              {quickError && <p className="text-xs text-destructive mt-2">{quickError}</p>}
              {quickSuccess && <p className="text-xs text-green-500 mt-2">{quickSuccess}</p>}
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-5">
                <Plus className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Dodaj produkt</h2>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Zdjęcie główne</label>
                  <ImageDropZone value={imageUrl} onChange={setImageUrl} />
                  <Input
                    placeholder="lub wklej URL zdjęcia…"
                    value={imageUrl.startsWith("data:") ? "" : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-background mt-2 text-sm h-9"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    Zdjęcia QC
                    {qcImages.length > 0 && (
                      <span className="ml-2 text-xs font-medium text-foreground">({qcImages.length})</span>
                    )}
                  </label>
                  <QCImagesZone images={qcImages} onChange={setQcImages} />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Nazwa</label>
                  <Input
                    placeholder="np. Air Jordan 1 High"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm text-muted-foreground">Krótki opis</label>
                    <Button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={aiLoading || !name.trim()}
                      size="sm"
                      className="h-7 px-2.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                      data-testid="button-generate-description"
                    >
                      {aiLoading ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                      )}
                      {aiLoading ? "Generuję…" : "Generuj AI"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Wpisz nazwę produktu wyżej i kliknij 'Generuj AI', albo opisz ręcznie…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-background resize-none text-sm"
                    rows={3}
                    data-testid="input-description"
                  />
                  {aiError && <p className="text-xs text-destructive mt-1">{aiError}</p>}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Ocena: <span className="font-semibold text-foreground">{rating}/10</span>
                  </label>
                  <RatingPicker value={rating} onChange={setRating} />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Cena</label>
                  <Input
                    placeholder="np. ¥380"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-background"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    Link Kakobuy
                  </label>
                  <Input
                    placeholder="https://www.kakobuy.com/item/details?url=…"
                    value={kakobuyLink}
                    onChange={(e) => setKakobuyLink(e.target.value)}
                    className="bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Link USFans
                  </label>
                  <Input
                    placeholder="https://usfans.com/product/3/…"
                    value={usfansLink}
                    onChange={(e) => setUsfansLink(e.target.value)}
                    className="bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Kategoria</label>
                  <Select value={category} onValueChange={(v) => setCategory(v as Product["category"])}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Batch</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBatch("best")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors
                        ${batch === "best"
                          ? "bg-yellow-500/15 border-yellow-500/60 text-yellow-300"
                          : "bg-background/70 border-border text-muted-foreground hover:border-yellow-500/40"}`}
                    >
                      <Crown className="h-4 w-4" />
                      Best Batch
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatch("budget")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors
                        ${batch === "budget"
                          ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300"
                          : "bg-background/70 border-border text-muted-foreground hover:border-emerald-500/40"}`}
                    >
                      <Wallet className="h-4 w-4" />
                      Budget Batch
                    </button>
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}
                <Button type="submit" className="w-full" disabled={!name || !price || !imageUrl || submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  {submitting ? "Dodawanie…" : "Dodaj produkt"}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Produkty</h2>
                </div>
                <span className="text-sm text-muted-foreground">{products.length} produktów</span>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 bg-background rounded-lg border border-border"
                  >
                    <div className="w-12 h-12 bg-accent rounded flex-shrink-0 overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{product.price}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          {product.rating}/10
                        </span>
                        {product.qcImages?.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{product.qcImages.length} QC</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(product.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {products.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Brak produktów</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
