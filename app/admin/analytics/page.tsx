"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  ArrowLeft,
  CalendarDays,
  Globe,
  Monitor,
  Smartphone,
  ServerCrash,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GlassCard from "@/components/effects/GlassCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ==================== Animation Variants ====================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ==================== Interfaces ====================

interface AnalyticsData {
  stats: any[];
  weekly: any[];
  maxViews: number;
  sources: any[];
  devices: any[];
}

// ==================== Mock Data Fallbacks ====================

const MOCK_DATA: AnalyticsData = {
  stats: [
    {
      label: "Total Page Views",
      value: "12,450",
      change: "+14.5%",
      isPositive: true,
      icon: Eye,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      label: "Unique Visitors",
      value: "8,234",
      change: "+8.2%",
      isPositive: true,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
    {
      label: "Bounce Rate",
      value: "42.3%",
      change: "-2.1%",
      isPositive: true,
      icon: MousePointerClick,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
    },
    {
      label: "Avg. Duration",
      value: "2m 45s",
      change: "+12s",
      isPositive: true,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/20",
    },
  ],
  weekly: [
    { day: "Mon", views: 1200 },
    { day: "Tue", views: 1500 },
    { day: "Wed", views: 1000 },
    { day: "Thu", views: 1800 },
    { day: "Fri", views: 2400 },
    { day: "Sat", views: 1900 },
    { day: "Sun", views: 1600 },
  ],
  maxViews: 2400,
  sources: [
    { name: "Direct", value: 45, color: "bg-cyan-500" },
    { name: "Organic", value: 30, color: "bg-purple-500" },
    { name: "Social", value: 15, color: "bg-pink-500" },
    { name: "Referral", value: 10, color: "bg-amber-500" },
  ],
  devices: [
    { name: "Desktop", value: 65, icon: Monitor },
    { name: "Mobile", value: 32, icon: Smartphone },
    { name: "Tablet", value: 3, icon: Globe },
  ],
};

// ==================== Helper ====================
function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function calculateChange(
  current: number,
  previous: number,
  inverse: boolean = false,
) {
  if (previous === 0) return { text: "+100%", isPositive: true };
  const diff = ((current - previous) / previous) * 100;
  const isPositive = inverse ? diff <= 0 : diff >= 0;
  return {
    text: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`,
    isPositive,
  };
}

// ==================== Main Component ====================

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [data, setData] = useState<AnalyticsData>(MOCK_DATA);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?range=${timeRange}`);
        const result = await res.json();

        if (!res.ok || result.error) {
          console.warn("Falling back to Mock Analytics Data:", result.error);
          setUsingMock(true);
          setData(MOCK_DATA);
        } else {
          setUsingMock(false);
          // Transform API response to UI shape
          const { overview, timeSeries, trafficSources, devices } = result;

          const pageViewsChange = calculateChange(
            overview.pageViews.current,
            overview.pageViews.previous,
          );
          const usersChange = calculateChange(
            overview.users.current,
            overview.users.previous,
          );
          const bounceChange = calculateChange(
            overview.bounceRate.current,
            overview.bounceRate.previous,
            true,
          ); // Lower bounce is better
          const durationChange = calculateChange(
            overview.avgSessionDuration.current,
            overview.avgSessionDuration.previous,
          );

          setData({
            stats: [
              {
                label: "Total Page Views",
                value: overview.pageViews.current.toLocaleString(),
                change: pageViewsChange.text,
                isPositive: pageViewsChange.isPositive,
                icon: Eye,
                color: "text-blue-400",
                bg: "bg-blue-500/20",
              },
              {
                label: "Unique Visitors",
                value: overview.users.current.toLocaleString(),
                change: usersChange.text,
                isPositive: usersChange.isPositive,
                icon: Users,
                color: "text-purple-400",
                bg: "bg-purple-500/20",
              },
              {
                label: "Bounce Rate",
                value: `${overview.bounceRate.current.toFixed(1)}%`,
                change: bounceChange.text,
                isPositive: bounceChange.isPositive,
                icon: MousePointerClick,
                color: "text-emerald-400",
                bg: "bg-emerald-500/20",
              },
              {
                label: "Avg. Duration",
                value: formatTime(overview.avgSessionDuration.current),
                change: durationChange.text,
                isPositive: durationChange.isPositive,
                icon: Clock,
                color: "text-amber-400",
                bg: "bg-amber-500/20",
              },
            ],
            weekly:
              timeSeries.length > 0
                ? timeSeries.map((t: any) => ({
                    day: t.date?.substring(6),
                    views: t.views,
                  }))
                : MOCK_DATA.weekly,
            maxViews:
              timeSeries.length > 0
                ? Math.max(...timeSeries.map((d: any) => d.views))
                : MOCK_DATA.maxViews,
            sources:
              trafficSources.length > 0
                ? trafficSources.slice(0, 4).map((s: any, i: number) => ({
                    name: s.source || "Direct",
                    value: s.users,
                    color:
                      i === 0
                        ? "bg-cyan-500"
                        : i === 1
                          ? "bg-purple-500"
                          : i === 2
                            ? "bg-pink-500"
                            : "bg-amber-500",
                  }))
                : MOCK_DATA.sources,
            devices:
              devices.length > 0
                ? devices.map((d: any) => ({
                    name: d.device || "Unknown",
                    value: d.users,
                    icon: d.device?.toLowerCase().includes("mobile")
                      ? Smartphone
                      : d.device?.toLowerCase().includes("tablet")
                        ? Globe
                        : Monitor,
                  }))
                : MOCK_DATA.devices,
          });
        }
      } catch (error) {
        setUsingMock(true);
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-cyan-500" />
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    Analytics Overview
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track your portfolio's performance and visitor engagement.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="btn-back-dashboard text-sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
                <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800/50 p-1">
                  {(["7d", "30d", "90d"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                        timeRange === range
                          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                      )}
                    >
                      {range.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[400px] flex items-center justify-center flex-col gap-4"
              >
                <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
                <p className="text-gray-400 animate-pulse">
                  Fetching from Google Analytics API...
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {usingMock && (
                  <GlassCard className="p-4 bg-amber-500/10 border-amber-500/30 flex items-center gap-3">
                    <ServerCrash className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-amber-500 font-medium text-sm">
                        Running securely in Mock Data Mode
                      </p>
                      <p className="text-amber-400/80 text-xs">
                        Environment variables for Google Analytics Service
                        Account were not detected. Add GA_PROPERTY_ID,
                        GA_CLIENT_EMAIL, and GA_PRIVATE_KEY to view live data.
                      </p>
                    </div>
                  </GlassCard>
                )}

                {/* Key Metrics */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {data.stats.map((stat, i) => (
                    <GlassCard
                      key={i}
                      className="p-6 relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className={cn("p-3 rounded-lg", stat.bg)}>
                          <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div
                          className={cn(
                            "flex items-center text-sm font-semibold",
                            stat.isPositive ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {stat.change}
                          <TrendingUp
                            className={cn(
                              "w-4 h-4 ml-1",
                              !stat.isPositive && "rotate-180 transform",
                            )}
                          />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                          {stat.label}
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                          stat.bg,
                        )}
                      />
                    </GlassCard>
                  ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Chart */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <GlassCard className="p-6 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-blue-400" />
                          Traffic Overview (Last {timeRange.replace(
                            "d",
                            "",
                          )}{" "}
                          Days)
                        </h2>
                      </div>
                      <div className="flex-1 flex items-end gap-2 sm:gap-4 h-64 pt-6 mt-auto">
                        {data.weekly.map((d: any, i: number) => (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-2 group"
                          >
                            <div className="relative w-full h-full flex items-end justify-center rounded-t-sm">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{
                                  height:
                                    data.maxViews === 0
                                      ? "0%"
                                      : `${(d.views / (data.maxViews || 1)) * 100}%`,
                                }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                className="w-full max-w-[40px] bg-gradient-to-t from-cyan-600/50 to-cyan-400/80 rounded-t-md relative group-hover:from-cyan-500 group-hover:to-cyan-300 transition-colors"
                              >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs py-1 px-2 rounded font-medium whitespace-nowrap shadow-lg">
                                  {d.views}
                                </div>
                              </motion.div>
                            </div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate w-full text-center">
                              {d.day}
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Sidebar Stats */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <GlassCard className="p-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-400" />
                        Traffic Sources
                      </h2>
                      <div className="space-y-5">
                        {data.sources.map((source: any, i: number) => {
                          const total =
                            data.sources.reduce(
                              (sum: number, s: any) => sum + s.value,
                              0,
                            ) || 1;
                          const percentage = Math.round(
                            (source.value / total) * 100,
                          );
                          return (
                            <div key={i}>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-300 font-medium">
                                  {source.name}
                                </span>
                                <span className="text-gray-900 dark:text-white font-bold">
                                  {percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: i * 0.2 }}
                                  className={cn(
                                    "h-full rounded-full",
                                    source.color,
                                  )}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-pink-400" />
                        Devices
                      </h2>
                      <div className="space-y-6">
                        {data.devices.map((device: any, i: number) => {
                          const total =
                            data.devices.reduce(
                              (sum: number, s: any) => sum + s.value,
                              0,
                            ) || 1;
                          const percentage = Math.round(
                            (device.value / total) * 100,
                          );
                          return (
                            <div key={i} className="flex items-center gap-4">
                              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <device.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                    {device.name}
                                  </span>
                                  <span className="text-gray-900 dark:text-white font-bold text-sm">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
