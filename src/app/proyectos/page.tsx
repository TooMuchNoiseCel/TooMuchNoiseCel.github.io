'use client';

import TiltedProjectList from "@/components/TiltedProjectList";
import Link from 'next/link'; // Importa Link

export default function ProyectosPage() {
  return (
    <main className="relative p-8"> {/* Añade padding si es necesario */}
      <TiltedProjectList />

      <div className="absolute top-8 left-8">
        <Link href="/" passHref>
          <button className="px-4 py-2 font-bold text-black bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            ← Volver al Inicio
          </button>
        </Link>
      </div>
    </main>
  );
}
