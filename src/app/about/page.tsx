import AboutUsHero from '@/components/AboutUsHero/AboutUsHero';
import AboutUsStory from '@/components/AboutUsStory/AboutUsStory';
import WhoAreWe from '@/components/WhoAreWe/WhoAreWe';
import MissionVision from '@/components/MissionVision/MissionVision';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import MatrimonyQueries from '@/components/MatrimonyQueries/MatrimonyQueries';

export default function AboutPage() {
    return (
        <main>
            <Navbar />
            <AboutUsHero />
            <AboutUsStory />
            <WhoAreWe />
            <MissionVision />
            <MatrimonyQueries />
            <Footer />
        </main>
    );
}
