import HeroBanner from "@/components/home/HeroBanner";
import GenreSection from "@/components/home/GenreSection";
import FeaturedEbooks from "@/components/home/FeaturedEbooks";
import TopWriters from "@/components/home/TopWriters";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <FeaturedEbooks />
      <TopWriters />
      <GenreSection />
    </main>
  );
}