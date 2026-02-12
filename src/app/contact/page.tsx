import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ContactHero from '@/components/ContactHero/ContactHero';
import ContactFormSection from '@/components/ContactFormSection/ContactFormSection';

export default function ContactPage() {
    return (
        <main>
            <Navbar />
            <ContactHero />
            <ContactFormSection />
            <Footer />
        </main>
    );
}
