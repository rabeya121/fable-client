
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedEbooks from "@/components/home/FeaturedEbooks";
import TopWriters from "@/components/home/TopWriters";
import GenreSection from "@/components/home/GenreSection";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <FeaturedEbooks />
      <TopWriters />
      <GenreSection />
    </main>
  );
}