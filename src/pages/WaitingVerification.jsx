import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const WaitingVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Check verification status every 5 seconds
    const checkVerification = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/check-verification/${email}`);
        const data = await response.json();
        
        if (data.verified) {
          setIsVerified(true);
          // Start countdown after verification
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate('/');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          // If not verified, check again in 5 seconds
          setTimeout(checkVerification, 5000);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setTimeout(checkVerification, 5000);
      }
    };

    checkVerification();
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {!isVerified ? (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  <FaEnvelope className="h-6 w-6 text-black" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Vérifiez votre email
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Nous avons envoyé un lien de vérification à{' '}
                  <span className="font-medium text-black">{email}</span>
                </p>
                <div className="mt-6">
                  <div className="relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: '100%' }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black animate-pulse"
                      ></div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  En attente de vérification...
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <FaCheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Email vérifié !
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Votre compte a été vérifié avec succès.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Redirection vers la page d'accueil dans {countdown} secondes...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingVerification;