"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import {
  Award,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Trophy,
  Star,
  Sparkles,
  Shield,
  Medal,
  Crown,
  Zap,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import GlassCard, {
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
} from "@/components/effects/GlassCard";
import { usePortfolioData } from "@/lib/hooks/useFirestore";
import type { Certification, Achievement } from "@/types/portfolio";

// ==================== Types ====================

interface CertificationsProps {
  className?: string;
  mockCertifications?: Certification[]; // For testing
  mockAchievements?: Achievement[]; // For testing
}

// ==================== Icon Mapping ====================

const achievementIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  trophy: Trophy,
  star: Star,
  medal: Medal,
  crown: Crown,
  shield: Shield,
  zap: Zap,
  target: Target,
  trending: TrendingUp,
  sparkles: Sparkles,
};

const getAchievementIcon = (
  category?: string,
): React.ComponentType<{ className?: string }> => {
  if (!category) return Trophy;
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("award")) return Trophy;
  if (lowerCategory.includes("publication")) return Star;
  if (lowerCategory.includes("contribution")) return Sparkles;
  if (lowerCategory.includes("certification")) return Medal;
  if (lowerCategory.includes("recognition")) return Crown;

  return Trophy;
};

// ==================== Animated Counter ====================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
}) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const isInView = useInView(countRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, { duration });
      return controls.stop;
    }
  }, [isInView, motionValue, value, duration]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      if (countRef.current) {
        countRef.current.textContent = String(latest);
      }
    });
    return () => unsubscribe();
  }, [rounded]);

  return <span ref={countRef}>0</span>;
};

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// ==================== Certification Card ====================

interface CertificationCardProps {
  certification: Certification;
  index: number;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const isExpired =
    certification.expiryDate && new Date(certification.expiryDate) < new Date();
  const isExpiringSoon =
    certification.expiryDate &&
    new Date(certification.expiryDate) <
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassCard
        variant="default"
        className="h-full relative overflow-hidden group"
        enableHover
      >
        {/* Badge Icon */}
        <div className="absolute top-4 right-4">
          <motion.div
            className={cn(
              "p-3 rounded-full",
              isExpired
                ? "bg-red-500/10 border border-red-500/30"
                : "bg-cyan-500/10 border border-cyan-500/30",
            )}
            animate={
              isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            {certification.badgeUrl ? (
              <button
                type="button"
                className="relative block"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageFullscreen(true);
                }}
              >
                <img
                  src={certification.badgeUrl}
                  alt={`${certification.title} badge`}
                  className="w-16 h-16 object-contain rounded-full shadow-lg border border-white/10 bg-white/5 p-1 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </button>
            ) : certification.icon ? (
              <span
                className="text-2xl"
                role="img"
                aria-label="certification badge"
              >
                {certification.icon}
              </span>
            ) : (
              <Award
                className={cn(
                  "w-6 h-6",
                  isExpired ? "text-red-400" : "text-cyan-400",
                )}
              />
            )}
          </motion.div>
        </div>

        <GlassCardHeader className="pb-3">
          <GlassCardTitle className="text-lg font-bold text-white pr-16">
            {certification.title}
          </GlassCardTitle>
          <GlassCardDescription className="text-gray-400 flex items-center gap-2 mt-2">
            <Shield className="w-4 h-4" />
            {certification.issuer}
          </GlassCardDescription>
        </GlassCardHeader>

        <GlassCardContent>
          {/* Issue Date */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span>
              Issued:{" "}
              {formatDate(certification.issueDate, {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>

          {/* Expiration Date */}
          {certification.expiryDate && (
            <div
              className={cn(
                "flex items-center gap-2 text-sm mb-3",
                isExpired
                  ? "text-red-400"
                  : isExpiringSoon
                    ? "text-yellow-400"
                    : "text-gray-400",
              )}
            >
              <Calendar className="w-4 h-4" />
              <span>
                {isExpired ? "Expired: " : "Expires: "}
                {formatDate(certification.expiryDate, {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          )}

          {/* No Expiration Badge */}
          {!certification.expiryDate && (
            <div className="flex items-center gap-2 text-sm text-green-400 mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>No Expiration</span>
            </div>
          )}

          {/* Description */}
          {certification.description && (
            <div className="mb-4">
              <p
                className={cn(
                  "text-gray-300 text-sm whitespace-pre-line",
                  !isExpanded && "line-clamp-3",
                )}
              >
                {certification.description}
              </p>
              {certification.description.length > 120 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-cyan-400 text-xs font-semibold mt-1 hover:text-cyan-300 transition-colors focus:outline-none"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* Credential ID */}
          {certification.credentialId && (
            <div className="text-xs text-gray-400 font-mono bg-white/5 py-1.5 px-3 rounded mb-4 inline-block max-w-full truncate overflow-hidden">
              <span className="text-gray-500 mr-1">ID:</span>{" "}
              {certification.credentialId}
            </div>
          )}

          {/* Verification Link */}
          {certification.credentialUrl && (
            <motion.a
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-colors",
                "text-cyan-400 hover:text-cyan-300",
              )}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              View Credential
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}

          {/* Status Badge */}
          <div className="mt-4 pt-3 border-t border-gray-800">
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold",
                isExpired
                  ? "bg-red-500/10 text-red-400 border border-red-500/30"
                  : "bg-green-500/10 text-green-400 border border-green-500/30",
              )}
            >
              <motion.div
                animate={!isExpired ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="w-3 h-3" />
              </motion.div>
              {isExpired ? "Expired" : "Active"}
            </div>
          </div>
        </GlassCardContent>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        />
      </GlassCard>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isImageFullscreen && certification.badgeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsImageFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all"
                onClick={() => setIsImageFullscreen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={certification.badgeUrl}
                alt={`${certification.title} badge fullscreen`}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ==================== Achievement Card ====================

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getAchievementIcon(achievement.category);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassCard
        variant="default"
        className="h-full relative overflow-hidden group"
        enableHover
      >
        {/* Achievement Icon */}
        <div className="absolute top-4 right-4">
          <motion.div
            className="p-3 rounded-full bg-purple-500/10 border border-purple-500/30"
            animate={
              isHovered ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            <IconComponent className="w-6 h-6 text-purple-400" />
          </motion.div>
        </div>

        <GlassCardHeader className="pb-3">
          <GlassCardTitle className="text-lg font-bold text-white pr-16">
            {achievement.title}
          </GlassCardTitle>
          {achievement.category && (
            <div className="mt-2">
              <span className="inline-block bg-purple-500/10 text-purple-400 text-xs font-medium px-3 py-1 rounded-full border border-purple-500/30">
                {achievement.category}
              </span>
            </div>
          )}
        </GlassCardHeader>

        <GlassCardContent>
          <p className="text-gray-300 text-sm mb-3">
            {achievement.description}
          </p>

          {/* Date */}
          {achievement.date && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(achievement.date, {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          )}

          {/* External Link */}
          {achievement.url && (
            <motion.a
              href={achievement.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              Learn More
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
        </GlassCardContent>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        />
      </GlassCard>
    </motion.div>
  );
};

// ==================== Loading Skeleton ====================

const CertificationsAchievementsSkeleton: React.FC = () => {
  return (
    <section
      id="certifications"
      className="relative py-16 md:py-24 lg:py-32 container mx-auto px-4"
    >
      {/* Heading Skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 w-96 max-w-full bg-gray-800 rounded mx-auto mb-2 animate-pulse" />
        <div className="h-6 w-64 bg-gray-800/50 rounded mx-auto animate-pulse" />
      </div>

      {/* Stats Skeleton */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass-card px-6 py-4 animate-pulse">
            <div className="h-8 w-16 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-800 rounded" />
          </div>
        ))}
      </div>

      {/* Certifications Skeleton */}
      <div className="mb-16">
        <div className="h-8 w-48 bg-gray-800 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-700 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-800 rounded mb-4" />
              <div className="h-4 w-full bg-gray-800 rounded mb-2" />
              <div className="h-4 w-5/6 bg-gray-800 rounded" />
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Achievements Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-800 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-700 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-800 rounded mb-4" />
              <div className="h-4 w-full bg-gray-800 rounded mb-2" />
              <div className="h-4 w-5/6 bg-gray-800 rounded" />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== Main Component ====================

const Certifications: React.FC<CertificationsProps> = ({
  className,
  mockCertifications,
  mockAchievements,
}) => {
  const { data, loading, error } = usePortfolioData();

  // Get certifications and achievements from portfolio data or mock data
  const certifications: Certification[] =
    mockCertifications || data?.certifications || [];
  const achievements: Achievement[] =
    mockAchievements || data?.achievements || [];

  // If using mock data, override loading and error states
  const isLoading = mockCertifications || mockAchievements ? false : loading;
  const hasError = mockCertifications || mockAchievements ? null : error;

  // Sort by order
  const sortedCertifications = [...certifications].sort(
    (a, b) => a.order - b.order,
  );
  const sortedAchievements = [...achievements].sort(
    (a, b) => a.order - b.order,
  );

  // Calculate stats
  const activeCertifications = certifications.filter(
    (cert) =>
      !cert.expiryDate || new Date(cert.expiryDate) > new Date(),
  ).length;

  // Loading state
  if (isLoading) {
    return <CertificationsAchievementsSkeleton />;
  }

  // Error state
  if (hasError) {
    return (
      <section
        id="certifications"
        className={cn(
          "relative py-16 md:py-24 lg:py-32 container mx-auto px-4",
          className,
        )}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gradient-animate"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Certifications & Achievements
        </motion.h2>
        <div className="text-center text-red-400">
          <p>Error loading data: {hasError.message}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (certifications.length === 0 && achievements.length === 0) {
    return (
      <section
        id="certifications"
        className={cn(
          "relative py-16 md:py-24 lg:py-32 container mx-auto px-4",
          className,
        )}
      >
        <motion.h2
          className="text-4xl font-bold text-center mb-12 text-gradient-animate"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Certifications & Achievements
        </motion.h2>
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg mb-2">
            No certifications or achievements available yet.
          </p>
          <p className="text-gray-500 text-sm">
            Add your credentials to Firestore to see them here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="certifications"
      className={cn(
        "relative py-16 md:py-24 lg:py-32 container mx-auto px-4",
        className,
      )}
    >
      {/* Section Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Certifications & Achievements
          <motion.span
            className="block h-1 w-24 mx-auto mt-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </h2>
        <p className="text-gray-400 text-lg mt-2">
          Professional credentials and notable accomplishments
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {certifications.length > 0 && (
          <GlassCard variant="bordered" className="px-6 py-4" enableHover>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={activeCertifications} />
                </div>
                <div className="text-xs text-gray-400">
                  Active Certifications
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {achievements.length > 0 && (
          <GlassCard variant="bordered" className="px-6 py-4" enableHover>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={achievements.length} />
                </div>
                <div className="text-xs text-gray-400">Achievements</div>
              </div>
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">
              Professional Certifications
            </h3>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedCertifications.map((cert, index) => (
              <CertificationCard
                key={cert.id}
                certification={cert}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: certifications.length > 0 ? 0.6 : 0.4,
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">
              Notable Achievements
            </h3>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Certifications;
