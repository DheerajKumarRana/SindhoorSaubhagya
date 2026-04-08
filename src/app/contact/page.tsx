import Footer from '@/components/Footer/Footer';
import ContactHero from '@/components/ContactHero/ContactHero';
import ContactFormSection from '@/components/ContactFormSection/ContactFormSection';

export default function ContactPage() {
    return (
        <main>
            <ContactHero />
            <ContactFormSection />
            <Footer
                topBarText="Over 7 Lakh families have already placed their trust in us. Yours could be next. Create your free profile today and take the first step toward something truly beautiful."
                topBarButtonText="Create a Free Profile"
                topBarButtonHref="/register"
            />
        </main>
    );
}
