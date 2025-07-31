// src/components/Button.tsx

import React from 'react';

// 1. Definimos los "props" con TypeScript.
// Estos son los parámetros que nuestro componente puede recibir.
interface ButtonProps {
  text: string; // El texto que mostrará el botón (obligatorio).
  onClick?: () => void; // Una función que se ejecutará al hacer clic (opcional).
  type?: 'button' | 'submit' | 'reset'; // El tipo de botón HTML.
}

// 2. Creamos el componente funcional de React.
// Recibe los props que definimos arriba.
const Button: React.FC<ButtonProps> = ({ text, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      // 3. Aquí está la magia de Tailwind CSS.
      // Aplicamos clases de utilidad para dar estilo directamente.
      className="
        bg-blue-600         
        text-white          
        font-bold           
        py-2                
        px-4                
        rounded-lg          
        hover:bg-blue-700   
        focus:outline-none  
        focus:ring-2        
        focus:ring-blue-500 
        focus:ring-opacity-50 
        transition-colors  
        duration-200      
      "
    >
      {text}
    </button>
  );
};

export default Button;
