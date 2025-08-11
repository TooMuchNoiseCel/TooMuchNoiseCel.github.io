import React from 'react';

const HybridArtifact: React.FC = () => {
  return (
    <>
      <style jsx global>{`
        .page-background {
          background-image: url('/back.png');
          background-color: #2a2a2a;
        }
        .ghost-text-bg::before {
          content: "SBMOT MULLEV FO TUO GUD SDROW TNEICNA AIV REHTONA OT SUOICSNO SPARKLY FLY AND HURT FLASHES OF INTUITION ANGER INSIGHT LOVE HATE NEED DIRECT LINES FROM ONE UNCONSCIOUS TO ANOTHER";
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
          color: rgba(0, 0, 0, 0.05); font-size: 24px; line-height: 1.2;
          text-transform: uppercase; transform: scaleX(-1); pointer-events: none; word-break: break-all;
        }
        .dither-effect::after {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-image: radial-gradient(rgba(0,0,0,0.4) 25%, transparent 25%);
          background-size: 3px 3px; pointer-events: none;
        }
        .custom-strike::after {
          content: ''; position: absolute; left: -2px; right: -2px; top: 50%;
          height: 2px; background-color: #1a1a1a;
        }
        .font-pixel {
          font-family: var(--font-press-start);
        }
        .font-typewriter {
          font-family: var(--font-special-elite);
        }
      `}</style>
      
      {/* Contenedor principal con el fondo de textura */}
      <div className="flex justify-center items-start min-h-screen p-4 sm:p-12 page-background">

        {/* El Documento Híbrido - LÍNEA CORREGIDA ABAJO */}
        <div className={`relative w-[620px] bg-[#fdfaf2] text-[#1a1a1a] font-typewriter shadow-2xl shadow-black/50
                        pt-[30px] pb-[30px] pl-[60px] pr-[30px] overflow-visible ghost-text-bg`}>
          
          <div className="absolute left-4 top-10 h-[95%] [writing-mode:vertical-rl] uppercase text-xs text-gray-600 z-20">
            NO SUCH THING AS A SECOND CHANCE. ONLY IF THE PRETTY IS UGLY, ONLY IF THE HURT IS REAL. WELL, A MAN. THE POLITICS OF PRURIENCE.
          </div>
          
          <div className="absolute top-[250px] -right-4 transform -rotate-90 z-20 text-center text-[8px] leading-tight text-gray-500 uppercase">
            MEMORIES & ECHOES<br />LIBRARY ARCHIVE
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            
            <header>
              <h1 className="font-pixel text-6xl leading-none">INTRX</h1>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-10 bg-black"></div>
                  <div className="w-4 h-10 bg-black"></div>
                  <div className="w-20 h-5 bg-black rounded-full"></div>
                </div>
                <div className="font-pixel text-3xl">555</div>
              </div>
            </header>

            <section className="flex gap-2.5 h-[220px]">
              <div className="relative flex-grow dither-effect">
                <img src="back.png" alt="Abstract black and white" className="w-full h-full object-cover grayscale" />
              </div>
              <div className="flex flex-col justify-around items-center w-[60px] p-2.5 border-2 border-black">
                <div className="relative w-10 h-10 border border-black rounded-full text-[8px]">
                  <div className="absolute w-full h-px bg-black top-1/2 -translate-y-1/2"></div>
                  <div className="absolute h-full w-px bg-black left-1/2 -translate-x-1/2"></div>
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2">N</span>
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2">S</span>
                  <span className="absolute -right-0.5 top-1/2 -translate-y-1/2">E</span>
                  <span className="absolute -left-0.5 top-1/2 -translate-y-1/2">W</span>
                </div>
                <div className="flex flex-col justify-evenly items-center w-5 h-32 border border-black rounded-full">
                  <span className="font-bold">2</span><div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="font-bold">7</span><div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="font-bold">2</span><div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="font-bold">7</span>
                </div>
              </div>
            </section>

            <section className="border-t border-black pt-5 uppercase">
              <p className="text-sm leading-relaxed mb-6">
                MORE DEPTH AND INCOHERENCE. <strong className="font-black">#LITTLE</strong> FIGURES LOST IN HYBRIDS ARE THE VISUALIZED <strong className="font-black">#SPACE</strong> WHERE ONLY WORDS ARE IMPOSSIBLE. THE HAND BEARS DOWN.
              </p>
              <div className="text-center text-lg tracking-widest my-4 leading-none">888888888888888888888888888</div>
              <p className="text-sm leading-relaxed mb-6">
                AN ADVERTISEMENT READS: <span className="border-b-2 border-black pb-0.5">"YOU ASKED FOR IT. YOU GOT IT".</span> <span className="tracking-[0.4em] text-gray-700">✦ ✚</span> FUCK YOU TOO.
              </p>
              <p className="text-sm leading-relaxed mb-6">
                WORDS AS SPERM. TONGUE AND MOUTH AS PENIS. <s className="relative custom-strike">WOMANTALK</s>, RECIPES FOR RESENTMENT SPREAD TO THE POLITICS OF PRURIENCE. MOTHER TONGUE <span className="inline-block w-12 h-3 border-2 border-black rounded-full align-middle mx-1"></span> DRAWN OVER PAPER. MOTHER'S RAGE AND CARE SPAT OUT ACROSS A PAGE.
              </p>
              <p className="text-center tracking-[4px] my-4">....................</p>
              <p className="text-sm leading-relaxed mb-6 indent-8">
                SPERO SUCKING IMAGERY FROM THE MIDDLE AGES, FROM TIBET, FROM EGYPT, FROM THE TABLOIDS, FROM THE BODY COUNTS-DOMESTIC AND FOREIGN. BITS AND PIECES, SLYLY RANDOM SO THE CLUES ARE NOT QUITE HIDDEN TO THE WHOLE. HERE AND THERE, NOW AND THEN, HITHER AND YON, TO AND FRO, COMING AND GOING.
              </p>
              <div className="text-center text-lg tracking-widest my-4 leading-none">XXXXXXXXXXXXXXXXXXXXXXXXXXX</div>
              <p className="text-sm leading-relaxed">
                LONG SCROLLS LIKE AN ATTENUATED IMAGE OF THE ARTIST IN A PAPER MIRROR. THE TENSION OF BE<s className="relative custom-strike">ING DRAWN</s> OUT, STRUNG OUT, ANGLES AND CURVES STRETCHED INTO OPPOSITION ON A FIELD THAT STILL CONFINES; THE TENSION OF HAVING SOMETHING TO SAY THAT IS FOREVER UNWINDING.
              </p>
            </section>
            
            <div className="flex h-12 items-stretch gap-0.5">
              <div className="bg-black" style={{ flexGrow: 3 }}></div><div className="bg-black" style={{ flexGrow: 8 }}></div><div className="bg-black" style={{ flexGrow: 3 }}></div><div className="bg-black" style={{ flexGrow: 3 }}></div><div className="bg-black" style={{ flexGrow: 8 }}></div><div className="bg-black" style={{ flexGrow: 3 }}></div><div className="bg-black" style={{ flexGrow: 5 }}></div><div className="bg-black" style={{ flexGrow: 3 }}></div><div className="bg-black" style={{ flexGrow: 8 }}></div><div className="bg-black" style={{ flexGrow: 3 }}></div><div className="bg-black" style={{ flexGrow: 8 }}></div><div className="bg-black" style={{ flexGrow: 3 }}></div>
            </div>

            <footer>
              <p className="text-center text-xs uppercase tracking-[0.25em]">On how to ease a troubled mind</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default HybridArtifact;
