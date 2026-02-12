import styles from "./page.module.css";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Testimonials from "@/components/Testimonials/Testimonials";
import Pricing from "@/components/Pricing/Pricing";
import StatsOfUs from "@/components/StatsOfUs/StatsOfUs";
import ContactUs from "@/components/ContactUs/ContactUs";
import MatrimonyQueries from "@/components/MatrimonyQueries/MatrimonyQueries";
import BrowseProfiles from "@/components/BrowseProfiles/BrowseProfiles";
import Footer from "@/components/Footer/Footer";


export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <Pricing />
      <StatsOfUs />
      <ContactUs />
      <MatrimonyQueries />
      <BrowseProfiles />
      <Footer />
    </main>
  );
}
