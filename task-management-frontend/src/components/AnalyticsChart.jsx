/**
 * AnalyticsChart — production-grade charts using Chart.js + react-chartjs-2.
 * Doughnut with centre stat · Gradient area line · Horizontal priority bars · Score gauge
 *
 * FIX: data is always a plain object (never a function).
 * Gradients are created in useEffect via chartRef.current.ctx after mount.
 */
import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  Filler,
);

// ── Shared tooltip style ──────────────────────────────────────────────────────
const tooltipDefaults = {
  backgroundColor: 'rgba(15,23,42,0.92)',
  titleColor: '#f1f5f9',
  bodyColor: '#94a3b8',
  borderColor: 'rgba(139,92,246,0.35)',
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  usePointStyle: true,
  boxWidth: 8,
  boxHeight: 8,
  boxPadding: 4,
};

// Simulate a 7-day series that ends at `value`
const spark = (value) => {
  const v = Math.max(value, 1);
  return [
    Math.round(v * 0.45), Math.round(v * 0.60), Math.round(v * 0.52),
    Math.round(v * 0.75), Math.round(v * 0.68), Math.round(v * 0.88), v,
  ];
};
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── 1. Doughnut ───────────────────────────────────────────────────────────────
const StatusDoughnut = ({ analytics }) => {
  const pct = analytics.totalTasks > 0
    ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
    : 0;

  const data = {
    labels: ['Pending', 'In Progress', 'Completed', 'Overdue'],
    datasets: [{
      data: [
        analytics.pendingTasks    || 0,
        analytics.inProgressTasks || 0,
        analytics.completedTasks  || 0,
        analytics.overdueTasks    || 0,
      ],
      backgroundColor: ['#fbbf24', '#3b82f6', '#22c55e', '#f97316'],
      borderColor:     ['#f59e0b', '#2563eb', '#16a34a', '#ea580c'],
      borderWidth: 2,
      hoverOffset: 10,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16, usePointStyle: true, pointStyle: 'circle',
          color: '#6b7280', font: { size: 11, weight: '500' },
        },
      },
      tooltip: {
        ...tooltipDefaults,
        callbacks: { label: (c) => `  ${c.label}: ${c.parsed} tasks` },
      },
    },
    animation: { animateRotate: true, duration: 900, easing: 'easeOutQuart' },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Task Distribution</h3>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          {analytics.totalTasks || 0} total
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">Status breakdown across all tasks</p>

      {/* Chart with centre label overlay */}
      <div className="relative h-52">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
             style={{ paddingBottom: 40 }}>
          <span className="text-3xl font-black text-gray-900 dark:text-white">{pct}%</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Done</span>
        </div>
      </div>

      {/* Mini stat strip */}
      <div className="grid grid-cols-4 gap-1 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        {[
          { label: 'Pending',  value: analytics.pendingTasks,    dot: 'bg-amber-400' },
          { label: 'Active',   value: analytics.inProgressTasks, dot: 'bg-blue-500'  },
          { label: 'Done',     value: analytics.completedTasks,  dot: 'bg-green-500' },
          { label: 'Overdue',  value: analytics.overdueTasks,    dot: 'bg-orange-500'},
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
              <span className="text-[10px] text-gray-400">{s.label}</span>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{s.value ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 2. Line — Weekly Activity with canvas gradients ───────────────────────────
const WeeklyLine = ({ analytics }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: DAYS,
    datasets: [
      {
        label: 'Assigned',
        data: spark(analytics.totalTasks || 0),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.15)',
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.45,
      },
      {
        label: 'Completed',
        data: spark(analytics.completedTasks || 0),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.12)',
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.45,
      },
    ],
  });

  // Upgrade to canvas gradients once chart has mounted
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const ctx = chart.ctx;

    const g1 = ctx.createLinearGradient(0, 0, 0, chart.height);
    g1.addColorStop(0, 'rgba(139,92,246,0.30)');
    g1.addColorStop(1, 'rgba(139,92,246,0.00)');

    const g2 = ctx.createLinearGradient(0, 0, 0, chart.height);
    g2.addColorStop(0, 'rgba(34,197,94,0.20)');
    g2.addColorStop(1, 'rgba(34,197,94,0.00)');

    setChartData(prev => ({
      ...prev,
      datasets: [
        { ...prev.datasets[0], backgroundColor: g1 },
        { ...prev.datasets[1], backgroundColor: g2 },
      ],
    }));
  }, []); // run once after first render

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top', align: 'end',
        labels: {
          usePointStyle: true, pointStyle: 'circle',
          color: '#6b7280', font: { size: 11, weight: '500' },
          padding: 16, boxWidth: 6, boxHeight: 6,
        },
      },
      tooltip: {
        ...tooltipDefaults,
        callbacks: { label: (c) => `  ${c.dataset.label}: ${c.parsed.y} tasks` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        border: { display: false, dash: [4, 4] },
        grid: { color: 'rgba(148,163,184,0.1)' },
        ticks: { color: '#9ca3af', font: { size: 11 }, stepSize: 1, padding: 8 },
      },
    },
    animation: { duration: 800, easing: 'easeOutQuart' },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Weekly Activity</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium border border-purple-100 dark:border-purple-800">
          This week
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">Assigned vs. completed trend</p>
      <div className="h-52">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

// ── 3. Horizontal Bar — Priority ──────────────────────────────────────────────
const PriorityBar = ({ analytics }) => {
  const chartRef = useRef(null);
  const baseData = [
    analytics.lowPriorityTasks    || 0,
    analytics.mediumPriorityTasks || 0,
    analytics.highPriorityTasks   || 0,
  ];
  const [chartData, setChartData] = useState({
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      label: 'Tasks',
      data: baseData,
      backgroundColor: ['rgba(148,163,184,0.8)', 'rgba(251,146,60,0.85)', 'rgba(248,113,113,0.85)'],
      borderColor:     ['#94a3b8', '#fb923c', '#f87171'],
      borderWidth: 0,
      borderRadius: { topRight: 8, bottomRight: 8 },
      borderSkipped: false,
      barThickness: 28,
    }],
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const ctx = chart.ctx;

    const makeH = (c1, c2) => {
      const g = ctx.createLinearGradient(0, 0, chart.width, 0);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      return g;
    };

    setChartData(prev => ({
      ...prev,
      datasets: [{
        ...prev.datasets[0],
        backgroundColor: [
          makeH('rgba(148,163,184,0.6)', 'rgba(100,116,139,0.9)'),
          makeH('rgba(251,146,60,0.7)',  'rgba(234,88,12,0.9)'),
          makeH('rgba(248,113,113,0.7)', 'rgba(220,38,38,0.9)'),
        ],
      }],
    }));
  }, []);

  const total = baseData.reduce((a, b) => a + b, 0);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipDefaults,
        callbacks: { label: (c) => `  ${c.parsed.x} tasks` },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: 'rgba(148,163,184,0.1)' },
        ticks: { color: '#9ca3af', font: { size: 11 }, stepSize: 1, padding: 8 },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#374151', font: { size: 12, weight: '600' }, padding: 10 },
      },
    },
    animation: { duration: 800, easing: 'easeOutQuart' },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Priority Breakdown</h3>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
          {total} tasks
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4">Tasks grouped by urgency level</p>
      <div className="h-28">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Percentage bars */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
        {[
          { label: 'High',   value: analytics.highPriorityTasks,   color: 'bg-red-500'   },
          { label: 'Medium', value: analytics.mediumPriorityTasks, color: 'bg-orange-400'},
          { label: 'Low',    value: analytics.lowPriorityTasks,    color: 'bg-slate-400' },
        ].map(p => {
          const pct = total > 0 ? Math.round(((p.value || 0) / total) * 100) : 0;
          return (
            <div key={p.label} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12">{p.label}</span>
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${p.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── 4. Score Gauge (pure SVG — no Chart.js) ───────────────────────────────────
const ScoreGauge = ({ analytics }) => {
  const score = analytics.productivityScore || 0;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? '🌟 Excellent' : score >= 40 ? '📈 Good Progress' : '💡 Needs Focus';

  // Needle tip tracks the SVG arc: center=(74,72), radius=58
  // score=0  → right end (132,72), score=100 → left end (16,72)
  const angle = Math.PI * (1 - score / 100);
  const nx = 74 + 58 * Math.cos(Math.PI - angle);
  const ny = 72 - 58 * Math.sin(angle);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Productivity Score</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full border"
              style={{ color, borderColor: color, background: `${color}18` }}>
          {label}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">Based on completion &amp; overdue rate</p>

      {/* Semicircle gauge */}
      <div className="flex flex-col items-center mt-2 flex-1">
        <div className="relative" style={{ width: 148, height: 84 }}>
          <svg width="148" height="84" viewBox="0 0 148 84">
            {/* track */}
            <path d="M 16 72 A 58 58 0 0 1 132 72"
              fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
            {/* filled arc */}
            <path d="M 16 72 A 58 58 0 0 1 132 72"
              fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={Math.PI * 58}
              strokeDashoffset={Math.PI * 58 * (1 - score / 100)}
              style={{ transition: 'stroke-dashoffset 1.2s ease-out, stroke 0.5s' }}
            />
            {/* needle dot */}
            <circle cx={nx} cy={ny} r="6" fill={color} stroke="white" strokeWidth="2.5"
              style={{ transition: 'all 1.2s ease-out' }}
            />
          </svg>
          {/* centre value */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
            <span className="text-3xl font-black" style={{ color }}>{score}</span>
            <span className="text-[10px] text-gray-400 -mt-0.5">out of 100</span>
          </div>
        </div>

        {/* scale labels */}
        <div className="flex justify-between w-36 mt-1">
          <span className="text-[10px] text-red-400 font-medium">Poor</span>
          <span className="text-[10px] text-yellow-500 font-medium">Good</span>
          <span className="text-[10px] text-green-500 font-medium">Great</span>
        </div>

        {/* stat grid */}
        <div className="grid grid-cols-2 gap-3 w-full mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl py-3">
            <p className="text-xl font-black text-gray-900 dark:text-white">{analytics.completionRate ?? 0}%</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Completion Rate</p>
          </div>
          <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl py-3">
            <p className="text-xl font-black text-gray-900 dark:text-white">{analytics.overdueTasks ?? 0}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Overdue Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
const AnalyticsChart = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <StatusDoughnut analytics={analytics} />
      <WeeklyLine     analytics={analytics} />
      <PriorityBar    analytics={analytics} />
      <ScoreGauge     analytics={analytics} />
    </div>
  );
};

export default AnalyticsChart;
