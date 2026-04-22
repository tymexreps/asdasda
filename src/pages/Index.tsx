import { Link } from "react-router-dom";
import { ArrowRight, Link2, Package, Database, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Link2, title: "Konwerter linków", description: "Konwertuj linki między platformami w kilka sekund", href: "/konwerter" },
  { icon: Package, title: "Śledzenie przesyłek", description: "Monitoruj status swojej paczki w czasie rzeczywistym", href: "/tracking" },
  { icon: Database, title: "Produkty", description: "Przeglądaj tysiące zdjęć QC od społeczności", href: "/qc" },
];

const benefits = [
  { icon: Shield, title: "Bezpieczne płatności", description: "Wszystkie transakcje są w pełni zabezpieczone" },
  { icon: Clock, title: "Wsparcie 24/7", description: "Nasz zespół jest zawsze gotowy do pomocy" },
  { icon: Users, title: "Aktywna społeczność", description: "Dołącz do tysięcy zadowolonych użytkowników" },
];

const faqs = [
  { question: "Czy KakoBuy jest bezpieczny?", answer: "Tak, KakoBuy to jeden z najpopularniejszych i najbezpieczniejszych agentów. Oferują ochronę kupującego i bezpieczne metody płatności." },
  { question: "Czy celnik mi zabierze paczkę?", answer: "Ryzyko zatrzymania paczki jest minimalne przy prawidłowym zadeklarowaniu wartości. Zalecamy deklarację 10-15$ za paczkę do 2kg." },
  { question: "Czy przesyłka jest droga?", answer: "Koszt przesyłki zależy od wagi i wybranej linii. Średnio to około 80-150 PLN za paczkę 2-3kg do Polski." },
  { question: "Jak długo trwa dostawa?", answer: "Czas dostawy wynosi zazwyczaj 10-20 dni roboczych w zależności od wybranej linii wysyłkowej." },
];

const Index = () => {
  return (
    <div className="flex flex-col">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Coś więcej niż zwykłe <span className="text-muted-foreground">rep community</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Najlepsze narzędzia do zamawiania z Chin. Konwertuj linki, śledź przesyłki i korzystaj z ekskluzywnych kuponów rabatowych.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <a href="https://discord.gg/tymexfinds" target="_blank" rel="noopener noreferrer">
                  Dołącz do Discord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/konwerter">Wypróbuj konwerter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Dlaczego my?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Najlepsze narzędzia do zamawiania z Chin w jednym miejscu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.href}
                className="group p-6 bg-background border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:bg-muted-foreground/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Często zadawane pytania</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="p-6 bg-background border border-border rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Zdecydowany?</h2>
            <p className="text-muted-foreground mb-8">Dołącz do nas i poznaj najlepsze repy na rynku!</p>
            <Button asChild size="lg" className="text-base">
              <a href="https://discord.gg/tymexfinds" target="_blank" rel="noopener noreferrer">
                Dołącz do Discord
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
