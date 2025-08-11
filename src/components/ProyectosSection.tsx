"use client";

import React from "react";
import { Element } from "react-scroll";
import Link from "next/link";
import { motion } from "framer-motion";

const COLORS = {
  bg: "#0b0d12",
  fg: "#e5e7eb",
  accent: "#60a5fa",
};

const ProyectosSection = () => {
  return (
    <Element name="proyectos-section">
      <section
        className="w-full min-h-[110vh] flex flex-col items-center justify-center text-center px-6 relative"
        style={{ backgroundColor: COLORS.bg, color: COLORS.fg }}
      >
        <motion.h2
          className="font-playfair text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Proyectos
        </motion.h2>

        <motion.p
          className="max-w-3xl leading-relaxed text-lg text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Cada proyecto es una oportunidad para resolver problemas reales a través del
          código y el diseño. Aquí presento una selección de trabajos donde he aplicado
          mi pasión por la tecnología para crear soluciones funcionales, intuitivas y
          estéticamente cuidadas.
        </motion.p>

        <motion.div
          className="absolute bottom-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            href="/proyectos"
            className="text-lg font-semibold hover:underline"
            style={{ color: COLORS.accent }}
          >
            Ver Proyectos
          </Link>
        </motion.div>
      </section>
    </Element>
  );
};

export default ProyectosSection;
