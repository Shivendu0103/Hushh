import React from "react";
import { cn } from "./canvas-text";
import { motion } from "framer-motion";

export const Meteors = ({ number, className }) => {
    const meteors = new Array(number || 20).fill(true);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            <style>{`
          @keyframes meteor {
            0% { transform: rotate(215deg) translateX(0); opacity: 1; }
            70% { opacity: 1; }
            100% {
              transform: rotate(215deg) translateX(-500px);
              opacity: 0;
            }
          }
          .animate-meteor-effect {
            animation: meteor 5s linear infinite;
          }
        `}</style>
            {meteors.map((el, idx) => {
                const meteorCount = number || 20;
                // Calculate position to evenly distribute meteors across container width
                const position = idx * (800 / meteorCount) - 400; // Spread across 800px range, centered

                return (
                    <span
                        key={"meteor" + idx}
                        className={cn(
                            "animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
                            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
                            className
                        )}
                        style={{
                            top: Math.floor(Math.random() * 100) + "%",
                            left: Math.floor(Math.random() * 100) + "%",
                            animationDelay: Math.random() * 5 + "s", // Random delay between 0-5s
                            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s", // Keep some randomness in duration
                        }}
                    ></span>
                );
            })}
        </motion.div>
    );
};
