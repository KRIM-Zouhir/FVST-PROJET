import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestion, FaTruck, FaMapMarkerAlt, FaMoneyBillWave, FaShieldAlt, FaUser } from 'react-icons/fa';

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg focus:outline-none"
        onClick={toggleOpen}
      >
        <span>{question}</span>
        {isOpen ? (
          <FaChevronUp className="text-black" />
        ) : (
          <FaChevronDown className="text-black" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  // State to track which FAQ items are open
  const [openFAQs, setOpenFAQs] = useState({});

  // Toggle function for FAQ items
  const toggleFAQ = (id) => {
    setOpenFAQs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // FAQ categories
  const faqCategories = [
    {
      id: 'general',
      title: 'Questions générales',
      icon: <FaQuestion className="text-black" />,
      faqs: [
        {
          id: 'what-is-fvst',
          question: "Qu'est-ce que FVST?",
          answer: "FVST est une plateforme de livraison qui connecte les expéditeurs avec un réseau de livreurs indépendants. Notre objectif est de simplifier la livraison de colis en proposant une solution flexible, rapide et économique."
        },
        {
          id: 'service-area',
          question: "Dans quelles zones géographiques opérez-vous?",
          answer: "Nous opérons actuellement dans toute la France métropolitaine. Notre réseau de points relais et de livreurs couvre aussi bien les zones urbaines que rurales."
        },
        {
          id: 'account-types',
          question: "Quels types de comptes proposez-vous?",
          answer: "Nous proposons trois types de comptes: Expéditeur (pour les particuliers ou entreprises qui souhaitent envoyer des colis), Livreur (pour ceux qui souhaitent effectuer des livraisons) et Entreprise (pour les sociétés ayant des besoins logistiques récurrents)."
        },
        {
          id: 'environmentally-friendly',
          question: "Êtes-vous une entreprise éco-responsable?",
          answer: "Absolument! Nous optimisons les itinéraires pour réduire l'empreinte carbone, encourageons l'utilisation de véhicules électriques parmi nos livreurs et développons continuellement des solutions pour minimiser notre impact environnemental."
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Expédition et livraison',
      icon: <FaTruck className="text-black" />,
      faqs: [
        {
          id: 'how-to-ship',
          question: "Comment envoyer un colis?",
          answer: "C'est simple! Créez un compte, indiquez les adresses de prise en charge et de livraison, précisez les dimensions et le poids du colis, choisissez une date de livraison et effectuez le paiement. Un livreur sera assigné à votre expédition."
        },
        {
          id: 'shipping-time',
          question: "Combien de temps prend une livraison?",
          answer: "Les délais varient selon la distance et le type de service choisi. Pour les livraisons en ville, nous proposons des options express en 2-3 heures. Pour les livraisons nationales, comptez 1 à 3 jours ouvrables."
        },
        {
          id: 'track-package',
          question: "Comment suivre mon colis?",
          answer: "Vous recevrez un numéro de suivi par email après confirmation de votre expédition. Connectez-vous à votre compte pour suivre votre colis en temps réel et recevoir des notifications à chaque étape de la livraison."
        },
        {
          id: 'package-restrictions',
          question: "Y a-t-il des restrictions sur ce que je peux expédier?",
          answer: "Oui, certains articles sont interdits: produits dangereux, illégaux, périssables sans emballage approprié, animaux vivants. Pour les articles de valeur (plus de 1000€), une assurance supplémentaire est recommandée."
        }
      ]
    },
    {
      id: 'relay-points',
      title: 'Points relais',
      icon: <FaMapMarkerAlt className="text-black" />,
      faqs: [
        {
          id: 'what-is-relay',
          question: "Qu'est-ce qu'un point relais FVST?",
          answer: "Un point relais est un emplacement partenaire où vous pouvez déposer ou récupérer vos colis. Ce système permet plus de flexibilité pour les expéditeurs et les destinataires qui ne peuvent pas être présents lors de la livraison."
        },
        {
          id: 'find-relay',
          question: "Comment trouver le point relais le plus proche?",
          answer: "Utilisez la fonction 'Trouver un point relais' sur notre application ou site web. Vous pouvez rechercher par adresse, code postal ou géolocalisation pour voir tous les points relais disponibles sur une carte."
        },
        {
          id: 'relay-hours',
          question: "Quels sont les horaires d'ouverture des points relais?",
          answer: "Les horaires varient selon chaque point relais. Ils sont clairement indiqués sur notre application et site web lorsque vous sélectionnez un point relais spécifique."
        },
        {
          id: 'relay-storage',
          question: "Combien de temps mon colis reste-t-il dans un point relais?",
          answer: "Les colis sont conservés pendant 7 jours calendaires. Passé ce délai, le colis est retourné à l'expéditeur et des frais supplémentaires peuvent s'appliquer."
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Tarifs et paiement',
      icon: <FaMoneyBillWave className="text-black" />,
      faqs: [
        {
          id: 'pricing-factors',
          question: "Comment sont calculés vos tarifs?",
          answer: "Nos tarifs sont basés sur plusieurs facteurs: distance de livraison, dimensions et poids du colis, urgence de la livraison, et si vous utilisez des points relais ou préférez une livraison à domicile."
        },
        {
          id: 'payment-methods',
          question: "Quels moyens de paiement acceptez-vous?",
          answer: "Nous acceptons les cartes de crédit/débit (Visa, Mastercard, American Express), PayPal, et pour les comptes entreprise, le paiement par virement ou à terme."
        },
        {
          id: 'business-pricing',
          question: "Proposez-vous des tarifs spéciaux pour les entreprises?",
          answer: "Oui, nous proposons des forfaits entreprise avec des tarifs préférentiels basés sur le volume d'expédition. Contactez notre équipe commerciale pour une offre personnalisée."
        },
        {
          id: 'additional-fees',
          question: "Y a-t-il des frais supplémentaires à prévoir?",
          answer: "Des frais supplémentaires peuvent s'appliquer pour les livraisons en dehors des heures standard, les zones difficiles d'accès, les colis très lourds ou volumineux, ou les assurances complémentaires."
        }
      ]
    },
    {
      id: 'security',
      title: 'Sécurité et assurance',
      icon: <FaShieldAlt className="text-black" />,
      faqs: [
        {
          id: 'package-insurance',
          question: "Les colis sont-ils assurés?",
          answer: "Tous les colis sont assurés de base jusqu'à 300€. Pour une valeur supérieure, nous proposons des options d'assurance complémentaires lors de la création de l'expédition."
        },
        {
          id: 'lost-package',
          question: "Que faire si mon colis est perdu ou endommagé?",
          answer: "Contactez immédiatement notre service client. Vous devrez fournir des détails sur l'expédition et, si possible, des photos du colis endommagé. Nous traiterons votre réclamation sous 48 heures ouvrables."
        },
        {
          id: 'driver-vetting',
          question: "Comment vérifiez-vous l'identité des livreurs?",
          answer: "Tous nos livreurs passent par un processus de vérification rigoureux incluant la vérification d'identité, du casier judiciaire, du permis de conduire et de l'assurance du véhicule. Nous évaluons également continuellement leurs performances."
        },
        {
          id: 'data-security',
          question: "Comment protégez-vous mes données personnelles?",
          answer: "Nous utilisons des protocoles de chiffrement avancés pour protéger vos données. Nous ne partageons jamais vos informations avec des tiers sans votre consentement et sommes en conformité avec le RGPD."
        }
      ]
    },
    {
      id: 'drivers',
      title: 'Pour les livreurs',
      icon: <FaUser className="text-black" />,
      faqs: [
        {
          id: 'become-driver',
          question: "Comment devenir livreur chez FVST?",
          answer: "Visitez notre page 'Devenir Livreur', créez un compte, complétez votre profil avec tous les documents nécessaires (pièce d'identité, permis de conduire, assurance), passez notre formation en ligne et commencez à livrer!"
        },
        {
          id: 'driver-earnings',
          question: "Combien peut gagner un livreur?",
          answer: "Les revenus varient selon le nombre de livraisons effectuées, les distances parcourues et les heures travaillées. Nos livreurs actifs gagnent en moyenne entre 15€ et 25€ de l'heure, pourboires inclus."
        },
        {
          id: 'driver-schedule',
          question: "Puis-je choisir mes propres horaires?",
          answer: "Absolument! C'est l'un des principaux avantages de travailler avec FVST. Vous avez une flexibilité totale pour choisir quand et combien vous souhaitez travailler."
        },
        {
          id: 'driver-requirements',
          question: "Ai-je besoin de mon propre véhicule?",
          answer: "Oui, vous devez disposer de votre propre véhicule (voiture, scooter, vélo) et des assurances appropriées. Certaines livraisons nécessitent des véhicules spécifiques en fonction de la taille et du poids du colis."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Questions Fréquemment Posées</h1>
          <p className="text-xl text-gray-600">
            Tout ce que vous devez savoir sur FVST et nos services de livraison
          </p>
        </div>

        {/* Search Bar - Functional in a real implementation */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une question..."
              className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="absolute right-3 top-3 text-gray-500 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {faqCategories.map(category => (
            <div key={category.id} className="mb-10">
              <div className="flex items-center mb-6">
                <div className="mr-3 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                {category.faqs.map(faq => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQs[faq.id] || false}
                    toggleOpen={() => toggleFAQ(faq.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions section */}
        <div className="max-w-4xl mx-auto mt-16 bg-black text-white rounded-lg overflow-hidden">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Vous avez encore des questions?</h2>
            <p className="text-lg mb-6">
              Notre équipe de support client est disponible pour vous aider.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:support@fvst.fr" 
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Nous contacter par email
              </a>
              <a 
                href="tel:+33123456789" 
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
              >
                Nous appeler
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 