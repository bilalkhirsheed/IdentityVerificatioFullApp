import React, { useState } from "react";
import BackButton from "../components/BackButton";

const Contact: React.FC = () => {
  const [openQuestions, setOpenQuestions] = useState<number[]>([0]); // Set initial state to [0]

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What does this service offer?",
      answer: (
        <em>
          We aim to help customers and businesses connect with greater
          confidence. Our platform facilitates information matching.
        </em>
      ),
    },
    {
      question: "How does it generally work?",
      answer: (
        <em>
          The system is designed to allow matching of customer and business
          information.
        </em>
      ),
    },
    {
      question: "Who might find this service useful?",
      answer: (
        <em>
          This service may be helpful for those seeking more reliable online
          interactions.
        </em>
      ),
    },
    {
      question: "Are there any costs associated with using this service?",
      answer: (
        <em>
          To determine the applicable payment methods and costs for each
          verification, please fill out the form. After submission, you will be
          guided to the cost information.
        </em>
      ),
    },
    {
      question: "I'm having trouble with my account. What can I do?",
      answer: (
        <em>
          Please contact our support team at help@verifycustomer.com, and they
          will assist you.
        </em>
      ),
    },
    {
      question: "I've forgotten my password. How can I reset it?",
      answer: (
        <em>
          You can attempt to reset your password by using the 'Forgot Password'
          link on the login page. If you experience difficulties, please email
          help@verifycustomer.com.
        </em>
      ),
    },
    {
      question: "What information is typically needed?",
      answer: (
        <em>
          The specific information required will vary depending on whether you
          are a customer or a business. The form will guide you.
        </em>
      ),
    },
    {
      question: "How long does verification usually take?",
      answer: (
        <em>
          The duration of the verification process can differ. We will provide
          updates as available.
        </em>
      ),
    },
    {
      question: "What happens if my verification isn't successful?",
      answer: (
        <em>
          You can reach out to help@verifycustomer.com, and our team can look
          into the situation.
        </em>
      ),
    },
    {
      question: "How can my business get verified?",
      answer: (
        <em>
          To get your business verified, go to the hamburger menu, select the
          'Join' section, and fill out the join form.
        </em>
      ),
    },
  ];

  return (
    <div className="helpContactPage">
      <BackButton />
      <h1>Help & Contact</h1>
      <h2>Frequently Asked Questions:</h2>
      <p>(Click on the questions to reveal the answers)</p>{" "}
      <div className="faq">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h2 className="faq-question" onClick={() => toggleQuestion(index)}>
              {faq.question}
            </h2>
            {openQuestions.includes(index) && (
              <p className="faq-answer">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
      <h2 style={{ marginTop: "3rem" }}>Contact Us</h2>
      <p>
        If you have any questions that aren't answered above, please contact us
        at:{" "}
        <a href="mailto:help@verifycustomer.com" target="_blank">
          help@verifycustomer.com
        </a>
        .
      </p>
    </div>
  );
};

export default Contact;
