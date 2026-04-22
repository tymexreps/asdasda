import { useState } from "react";
import { Package, Search, Plane, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

const mockTrackingData: TrackingEvent[] = [
  { date: "2024-01-15", time: "14:32", location: "Warszawa, Polska", status: "delivered", description: "Przesyłka dostarczona" },
  { date: "2024-01-15", time: "08:15", location: "Warszawa, Polska", status: "out_for_delivery", description: "Przesyłka w drodze do odbiorcy" },
  { date: "2024-01-14", time: "22:45", location: "Centrum Sortownicze", status: "in_transit", description: "Przesyłka w centrum sortowniczym" },
  { date: "2024-01-12", time: "16:20", location: "Odprawa celna", status: "customs", description: "Przesyłka odprawiona przez celników" },
  { date: "2024-01-10", time: "03:45", location: "Guangzhou, Chiny", status: "departed", description: "Przesyłka opuściła kraj nadania" },
  { date: "2024-01-08", time: "19:30", location: "Guangzhou, Chiny", status: "shipped", description: "Przesyłka nadana przez sprzedawcę" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "out_for_delivery":
      return <Truck className="h-5 w-5 text-blue-500" />;
    case "in_transit":
      return <Plane className="h-5 w-5 text-foreground" />;
    case "customs":
      return <MapPin className="h-5 w-5 text-yellow-500" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
};

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingNumber) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTrackingData(mockTrackingData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Śledzenie przesyłek</h1>
            <p className="text-muted-foreground">Sprawdź status swojej paczki w czasie rzeczywistym</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8">
            <div className="flex gap-3">
              <Input
                placeholder="Wpisz numer śledzenia..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="bg-background"
              />
              <Button onClick={handleTrack} disabled={!trackingNumber || isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Obsługujemy numery z: 17Track, YunTrack, ParcelsApp i więcej
            </p>
          </div>

          {trackingData && (
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Numer śledzenia</p>
                  <p className="font-mono font-medium text-foreground">{trackingNumber}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">Dostarczona</span>
                </div>
              </div>

              <div className="space-y-0">
                {trackingData.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-background border border-border rounded-full">
                        {getStatusIcon(event.status)}
                      </div>
                      {index < trackingData.length - 1 && <div className="w-px h-full min-h-[60px] bg-border" />}
                    </div>

                    <div className="pb-8">
                      <p className="font-medium text-foreground">{event.description}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.date} {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!trackingData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-medium text-foreground mb-2">Skąd wziąć numer?</h3>
                <p className="text-sm text-muted-foreground">
                  Numer śledzenia znajdziesz w panelu agenta po wysłaniu paczki.
                </p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="font-medium text-foreground mb-2">Czas aktualizacji</h3>
                <p className="text-sm text-muted-foreground">
                  Status przesyłki może być aktualizowany z opóźnieniem 12-24h.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
