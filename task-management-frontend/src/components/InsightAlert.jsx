/**
 * InsightAlert component — displays AI-powered productivity insights.
 * Shows dynamic recommendations based on task analysis.
 */
import React, { useState, useEffect } from 'react';
import { insightsAPI } from '../services/api';
import { Brain, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import Loader from './Loader';

const InsightAlert = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await insightsAPI.get();
      setInsights(res.data.data);
    } catch (err) {
      console.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // Auto-cycle through insights
  useEffect(() => {
    if (!insights?.insights?.length) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % insights.insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [insights]);

  const getStatusBadge = (status) => {
    const badges = {
      EXCELLENT: { label: 'Excellent', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      ON_TRACK: { label: 'On Track', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      AT_RISK: { label: 'At Risk', class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      CRITICAL: { label: 'Critical', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      NO_TASKS: { label: 'No Tasks', class: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
    };
    return badges[status] || badges.NO_TASKS;
  };

  if (loading) return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
      <Loader size="sm" text="Generating insights..." />
    </div>
  );

  const badge = getStatusBadge(insights?.overallStatus);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI Productivity Insights</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by task analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.class}`}>
            {badge.label}
          </span>
          <button
            onClick={fetchInsights}
            className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Current Insight */}
      {insights?.insights?.length > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/50 rounded-xl p-4 mb-4 min-h-[60px] flex items-center">
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed animate-fade-in" key={currentIndex}>
            {insights.insights[currentIndex]}
          </p>
        </div>
      )}

      {/* Insight Dots */}
      {insights?.insights?.length > 1 && (
        <div className="flex items-center gap-1.5 mb-4">
          {insights.insights.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 bg-purple-600'
                  : 'w-1.5 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Recommendation */}
      {insights?.recommendation && (
        <div className="flex items-start gap-2 pt-3 border-t border-purple-200/50 dark:border-purple-700/30">
          <Zap className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600 dark:text-gray-400">{insights.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default InsightAlert;
