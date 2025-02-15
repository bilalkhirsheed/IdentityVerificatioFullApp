import React, { useState } from "react";

const Contact: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "What does this service offer?",
      answer:
        "We aim to help customers and businesses connect with greater confidence. Our platform facilitates information matching.",
    },
    {
      question: "How does it generally work?",
      answer:
        "The system is designed to allow matching of customer and business information.",
    },
    {
      question: "Who might find this service useful?",
      answer:
        "This service may be helpful for those seeking more reliable online interactions.",
    },
    {
      question: "Are there any costs associated with using this service?",
      answer:
        "To determine the applicable payment methods and costs for each verification, please fill out the form. After submission, you will be guided to the cost information.",
    },
    {
      question: "I'm having trouble with my account. What can I do?",
      answer:
        "Please contact our support team at help@verifycustomer.com, and they will assist you.",
    },
    {
      question: "I've forgotten my password. How can I reset it?",
      answer:
        "You can attempt to reset your password by using the 'Forgot Password' link on the login page. If you experience difficulties, please email help@verifycustomer.com.",
    },
    {
      question: "What information is typically needed?",
      answer:
        "The specific information required will vary depending on whether you are a customer or a business. The form will guide you.",
    },
    {
      question: "How long does verification usually take?",
      answer:
        "The duration of the verification process can differ. We will provide updates as available.",
    },
    {
      question: "What happens if my verification isn't successful?",
      answer:
        "You can reach out to help@verifycustomer.com, and our team can look into the situation.",
    },
    {
      question: "How can my business get verified?",
      answer:
        "To get your business verified, go to the hamburger menu, select the 'Join' section, and fill out the join form.",
    },
  ];

  return (
    <div className="helpContact">
      <h1>Help & Contact</h1>
      <h2>Frequently Asked Questions:</h2>
      <div className="faq">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h2 className="faq-question" onClick={() => toggleQuestion(index)}>
              {faq.question}
            </h2>
            {openQuestion === index && (
              <p className="faq-answer">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
      <h2>Contact Us</h2>
      <p>
        If you have any questions that aren't answered above, please contact us
        at{" "}
        <a href="mailto:help@verifycustomer.com" target="_blank">
          help@verifycustomer.com
        </a>
        .
      </p>
    </div>
  );
};

export default Contact;
