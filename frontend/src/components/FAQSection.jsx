import React, { useState } from "react";
import "./styles/FAQSection.css";

function FAQSection() {
  const [open, setOpen] = useState(null);

  const toggleFAQ = (index) => {
    setOpen(open === index ? null : index);
  };

  const faqs = [
    { question: "What is Smart City Public Infrastructure Management?", answer: "It involves optimizing and monitoring public infrastructure in real-time to ensure efficient city operations." },
    { question: "How can I report an infrastructure issue?", answer: "Use our contact form above or reach out to our service centers directly." },
    { question: "What services are managed under this?", answer: "Traffic systems, water management, public safety, and energy are some of the areas we manage." },
  ];

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <ul>
        {faqs.map((faq, index) => (
          <li key={index} className={`faq-item ${open === index ? "open" : ""}`} onClick={() => toggleFAQ(index)}>
            <h3>{faq.question}</h3>
            {open === index && <p>{faq.answer}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FAQSection;
