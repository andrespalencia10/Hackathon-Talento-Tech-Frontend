"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
      <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
    </svg>
  );
}

export default function OAuthButtons({ modo = "login" }) {
  const textoGoogle = modo === "registro" ? "Registrarse con Google" : "Continuar con Google";
  const textoMicrosoft = modo === "registro" ? "Registrarse con Microsoft" : "Continuar con Microsoft";

  const handleGoogle = () => {
    window.location.href = `${API_URL}/api/v1/auth/google`;
  };

  const handleMicrosoft = () => {
    window.location.href = `${API_URL}/api/v1/auth/microsoft`;
  };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-3 text-xs text-gray-400 whitespace-nowrap">o continúa con</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <GoogleIcon />
        {textoGoogle}
      </button>

      <button
        type="button"
        onClick={handleMicrosoft}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <MicrosoftIcon />
        {textoMicrosoft}
      </button>
    </div>
  );
}
