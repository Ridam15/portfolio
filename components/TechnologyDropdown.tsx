'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnologyDropdownProps {
    technologies: string[];
    selectedTech: string;
    onSelectTech: (tech: string) => void;
    projectCounts: Record<string, number>;
    maxVisible?: number;
}

export function TechnologyDropdown({
    technologies,
    selectedTech,
    onSelectTech,
    projectCounts,
    maxVisible = 5,
}: TechnologyDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get top technologies by project count (excluding "All")
    const topTechnologies = technologies
        .filter((tech) => tech !== 'All')
        .sort((a, b) => (projectCounts[b] || 0) - (projectCounts[a] || 0))
        .slice(0, maxVisible);

    // Remaining technologies for dropdown
    const remainingTechnologies = technologies
        .filter((tech) => tech !== 'All' && !topTechnologies.includes(tech))
        .sort();

    const handleSelect = (tech: string) => {
        onSelectTech(tech);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-wrap gap-3 justify-center items-center">
            {/* All Button - Always First */}
            <motion.button
                onClick={() => handleSelect('All')}
                className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                    selectedTech === 'All'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                        : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                All
                <span className={cn(
                    'ml-1.5 text-xs',
                    selectedTech === 'All' ? 'text-cyan-400' : 'text-gray-500 dark:text-gray-500'
                )}>
                    ({projectCounts['All'] || 0})
                </span>
            </motion.button>

            {/* Top Technologies */}
            {topTechnologies.map((tech) => (
                <motion.button
                    key={tech}
                    onClick={() => handleSelect(tech)}
                    className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                        selectedTech === tech
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                            : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {tech}
                    <span className={cn(
                        'ml-1.5 text-xs',
                        selectedTech === tech ? 'text-cyan-400' : 'text-gray-500'
                    )}>
                        ({projectCounts[tech] || 0})
                    </span>
                </motion.button>
            ))}

            {/* More Dropdown */}
            {remainingTechnologies.length > 0 && (
                <div ref={dropdownRef} className="relative">
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-2',
                            isOpen || (selectedTech !== 'All' && !topTechnologies.includes(selectedTech))
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Filter className="w-4 h-4" />
                        More
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full mt-2 right-0 w-64 max-h-96 overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-cyan-500/20 rounded-lg shadow-2xl shadow-cyan-500/10 z-50"
                            >
                                <div className="p-2">
                                    {remainingTechnologies.map((tech) => {
                                        const isSelected = selectedTech === tech;
                                        return (
                                            <motion.button
                                                key={tech}
                                                onClick={() => handleSelect(tech)}
                                                className={cn(
                                                    'w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group',
                                                    isSelected
                                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                                                )}
                                                whileHover={{ x: 4 }}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                                                    {tech}
                                                </span>
                                                <span className={cn(
                                                    'text-xs',
                                                    isSelected ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-400'
                                                )}>
                                                    {projectCounts[tech] || 0}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
