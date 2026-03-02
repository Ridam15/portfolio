'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700" />
        );
    }

    return (
        <motion.button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-10 h-10 rounded-full bg-gray-800/50 dark:bg-gray-800/50 border border-gray-700 dark:border-gray-700 hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-center group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : 180,
                    scale: theme === 'dark' ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Moon className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'light' ? 0 : -180,
                    scale: theme === 'light' ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute"
            >
                <Sun className="w-5 h-5 text-yellow-400" />
            </motion.div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all duration-300" />
        </motion.button>
    );
}
