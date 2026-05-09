/**
 * DashboardCards — high-end metric cards with animated counters,
 * mini sparkline bars, and gradient glassmorphism styling.
 */
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Animated number counter
const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
};

// Tiny sparkline bars
const Sparkline = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-70 transition-all duration-500"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            minHeight: '2px',
          }}
        />
      ))}
    </div>
  );
};

const MetricCard = ({ title, value, total, icon: Icon, colors, trend, trendValue, sparkData, delay = 0 }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  const TrendIcon = trendValue > 0 ? TrendingUp : trendValue < 0 ? TrendingDown : Minus;
  const trendColor = trendValue > 0 ? 'text-emerald-500' : trendValue < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 border animate-fade-in group cursor-default"
      style={{
        background: colors.cardBg,
        borderColor: colors.border,
        animationDelay: `${delay}ms`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.06), 0 4px 16px ${colors.shadow}`,
      }}
    >
      {/* Gradient orb background */}
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: colors.orb }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: colors.iconBg }}
        >
          <Icon className="h-5 w-5" style={{ color: colors.iconColor }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{trend}</span>
        </div>
      </div>

      {/* Value */}
      <div className="relative z-10 mb-1">
        <p className="text-3xl font-bold tracking-tight" style={{ color: colors.value }}>
          <AnimatedNumber value={value} />
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: colors.label }}>{title}</p>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="relative z-10 mt-3 mb-3">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: colors.trackBg }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${pct}%`, background: colors.progress }}
            />
          </div>
          <p className="text-[10px] mt-1" style={{ color: colors.label }}>{pct}% of total</p>
        </div>
      )}

      {/* Sparkline */}
      <div className="relative z-10">
        <Sparkline data={sparkData} color={colors.spark} />
      </div>
    </div>
  );
};

const DashboardCards = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const total = analytics.totalTasks || 1;

  // Simulated sparkline data (last 7 relative data points based on real values)
  const makeSpark = (val) => {
    const base = Math.max(1, val);
    return [
      Math.round(base * 0.5), Math.round(base * 0.65), Math.round(base * 0.55),
      Math.round(base * 0.8), Math.round(base * 0.7), Math.round(base * 0.9), base
    ];
  };

  const cards = [
    {
      title: 'Total Tasks',
      value: analytics.totalTasks ?? 0,
      total: null,
      icon: ListTodo,
      trend: 'All tasks',
      trendValue: 0,
      sparkData: makeSpark(analytics.totalTasks),
      delay: 0,
      colors: {
        cardBg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
        border: '#ddd6fe',
        shadow: 'rgba(139,92,246,0.12)',
        orb: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
        iconBg: 'rgba(139,92,246,0.15)',
        iconColor: '#7c3aed',
        value: '#5b21b6',
        label: '#7c3aed',
        trackBg: '#ede9fe',
        progress: 'linear-gradient(90deg,#8b5cf6,#6d28d9)',
        spark: 'linear-gradient(180deg,#8b5cf6,#a78bfa)',
      },
    },
    {
      title: 'Completed',
      value: analytics.completedTasks ?? 0,
      total,
      icon: CheckCircle2,
      trend: `${analytics.completionRate ?? 0}% rate`,
      trendValue: 1,
      sparkData: makeSpark(analytics.completedTasks),
      delay: 80,
      colors: {
        cardBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '#bbf7d0',
        shadow: 'rgba(34,197,94,0.12)',
        orb: 'linear-gradient(135deg,#22c55e,#15803d)',
        iconBg: 'rgba(34,197,94,0.15)',
        iconColor: '#16a34a',
        value: '#15803d',
        label: '#16a34a',
        trackBg: '#dcfce7',
        progress: 'linear-gradient(90deg,#22c55e,#16a34a)',
        spark: 'linear-gradient(180deg,#22c55e,#4ade80)',
      },
    },
    {
      title: 'In Progress',
      value: analytics.inProgressTasks ?? 0,
      total,
      icon: Clock,
      trend: 'Active now',
      trendValue: 0,
      sparkData: makeSpark(analytics.inProgressTasks),
      delay: 160,
      colors: {
        cardBg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '#bfdbfe',
        shadow: 'rgba(59,130,246,0.12)',
        orb: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
        iconBg: 'rgba(59,130,246,0.15)',
        iconColor: '#2563eb',
        value: '#1d4ed8',
        label: '#2563eb',
        trackBg: '#dbeafe',
        progress: 'linear-gradient(90deg,#3b82f6,#2563eb)',
        spark: 'linear-gradient(180deg,#3b82f6,#60a5fa)',
      },
    },
    {
      title: 'Overdue',
      value: analytics.overdueTasks ?? 0,
      total,
      icon: AlertTriangle,
      trend: analytics.overdueTasks > 0 ? 'Needs action' : 'All clear',
      trendValue: analytics.overdueTasks > 0 ? -1 : 1,
      sparkData: makeSpark(analytics.overdueTasks),
      delay: 240,
      colors: {
        cardBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        border: '#fed7aa',
        shadow: 'rgba(249,115,22,0.12)',
        orb: 'linear-gradient(135deg,#f97316,#c2410c)',
        iconBg: 'rgba(249,115,22,0.15)',
        iconColor: '#ea580c',
        value: '#c2410c',
        label: '#ea580c',
        trackBg: '#ffedd5',
        progress: 'linear-gradient(90deg,#f97316,#ea580c)',
        spark: 'linear-gradient(180deg,#f97316,#fb923c)',
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default DashboardCards;
