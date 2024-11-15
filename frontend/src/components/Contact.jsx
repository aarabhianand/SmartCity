import React, { useEffect } from "react";
import "./styles/Contact.css";
import ContactForm from "./ContactForm";
import FAQSection from "./FAQSection";

function Contact() {
  useEffect(() => {
    // Add the class when the component mounts
    document.body.classList.add('contact-page-body');

    // Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove('contact-page-body');
    };
  }, []);

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>Get in Touch with CITI-FIX-IT-FELIX</h1>
        <p>Connecting you to the future of public infrastructure management</p>
      </div>

      <div className="contact-container">
        <ContactForm />
        <FAQSection />
      </div>
    </div>
  );
}

export default Contact;
