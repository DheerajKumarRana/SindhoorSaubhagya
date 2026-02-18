import AboutUsHero from '@/components/AboutUsHero/AboutUsHero';
import AboutUsStory from '@/components/AboutUsStory/AboutUsStory';
import WhoAreWe from '@/components/WhoAreWe/WhoAreWe';
import MissionVision from '@/components/MissionVision/MissionVision';
import Footer from '@/components/Footer/Footer';
import MatrimonyQueries from '@/components/MatrimonyQueries/MatrimonyQueries'; // Restored

export default function AboutPage() {
    return (
        <main>
            <AboutUsHero />
            <AboutUsStory />
            <WhoAreWe />
            <MissionVision />
            <MatrimonyQueries />
            <Footer />
        </main>
    );
}
