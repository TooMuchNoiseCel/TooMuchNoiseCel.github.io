interface CartaGiratoriaProps {
  imageSrc: string;   // URL de la imagen o GIF
  linkUrl: string;    // A dónde lleva el enlace
  linkText: string;   // Texto del botón/enlace
  title?: string;     // Título opcional para la parte trasera
  altText?: string;
}

export default function VoroniCell({
  imageSrc,
  linkUrl,
  linkText,
  title = "Ver más",
  altText = "Imagen de carta"
}: CartaGiratoriaProps) {
  return (
    <div className="group w-full h-full [perspective:1000px] cursor-pointer">

      <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-xl">

        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden">
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="absolute inset-0 w-full h-full  text-white rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center p-6 text-center shadow-inner">

          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover absolute blur-md"
          />

          <h3 className="text-2xl font-bold mb-4 relative">{title}</h3>

          <p className="text-sm text-indigo-100 mb-6 relative">
            Haz click abajo para continuar
          </p>

          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className=" relative px-6 py-2 bg-white text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-colors duration-300 shadow-md transform hover:scale-105"
          >
            {linkText}
          </a>

        </div>

      </div>
    </div>
  );
}
