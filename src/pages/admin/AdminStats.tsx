import React, { useState, useMemo } from 'react';
import {
  Users,
  Eye,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { VisitEvent } from '../../lib/supabase';

interface AdminStatsProps {
  events: VisitEvent[];
  onRefresh?: () => void;
}

type TimeRange = '7d' | '30d' | 'all';

export const AdminStats: React.FC<AdminStatsProps> = ({ events, onRefresh }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Filter events by selected time range
  const filteredEvents = useMemo(() => {
    if (timeRange === 'all') return events;
    const now = Date.now();
    const daysLimit = timeRange === '7d' ? 7 : 30;
    const cutoff = now - daysLimit * 86400000;
    return events.filter((e) => {
      const timestamp = e.created_at ? new Date(e.created_at).getTime() : now;
      return timestamp >= cutoff;
    });
  }, [events, timeRange]);

  // Key metrics calculation
  const metrics = useMemo(() => {
    const uniqueSessions = new Set(filteredEvents.map((e) => e.session_id)).size;
    const pageViewEvents = filteredEvents.filter((e) => e.event_type === 'page_vue');
    const totalPageViews = pageViewEvents.length;

    // Average duration across all page views
    const totalDuration = pageViewEvents.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
    const avgDurationSeconds = totalPageViews > 0 ? Math.round(totalDuration / totalPageViews) : 0;

    // Funnel events
    const step1Sessions = new Set(
      filteredEvents.filter((e) => e.event_type === 'etape_formulaire' && e.page_or_step === '1').map((e) => e.session_id)
    ).size;
    const submittedSessions = new Set(
      filteredEvents.filter((e) => e.event_type === 'formulaire_soumis').map((e) => e.session_id)
    ).size;

    const completionRate =
      step1Sessions > 0 ? Math.round((submittedSessions / step1Sessions) * 100) : 0;

    return {
      uniqueSessions,
      totalPageViews,
      avgDurationSeconds,
      step1Sessions,
      submittedSessions,
      completionRate,
    };
  }, [filteredEvents]);

  // 1. Pages Most Visited Data
  const pagesData = useMemo(() => {
    const pageCounts: Record<string, { views: number; totalDuration: number }> = {
      '/': { views: 0, totalDuration: 0 },
      '/offres': { views: 0, totalDuration: 0 },
      '/projets': { views: 0, totalDuration: 0 },
      '/a-propos': { views: 0, totalDuration: 0 },
    };

    filteredEvents
      .filter((e) => e.event_type === 'page_vue')
      .forEach((e) => {
        const p = e.page_or_step || '/';
        if (!pageCounts[p]) {
          pageCounts[p] = { views: 0, totalDuration: 0 };
        }
        pageCounts[p].views += 1;
        pageCounts[p].totalDuration += e.duration_seconds || 0;
      });

    const pageLabels: Record<string, string> = {
      '/': 'Accueil',
      '/offres': 'Offres',
      '/projets': 'Mes projets',
      '/a-propos': 'À propos',
    };

    return Object.entries(pageCounts)
      .map(([path, data]) => ({
        path,
        name: pageLabels[path] || path,
        views: data.views,
        avgDuration: data.views > 0 ? Math.round(data.totalDuration / data.views) : 0,
      }))
      .sort((a, b) => b.views - a.views);
  }, [filteredEvents]);

  // 2. Form Funnel Step Data
  const funnelData = useMemo(() => {
    const step1 = new Set(
      filteredEvents.filter((e) => e.event_type === 'etape_formulaire' && e.page_or_step === '1').map((e) => e.session_id)
    ).size;
    const step2 = new Set(
      filteredEvents.filter((e) => e.event_type === 'etape_formulaire' && e.page_or_step === '2').map((e) => e.session_id)
    ).size;
    const step3 = new Set(
      filteredEvents.filter((e) => e.event_type === 'etape_formulaire' && e.page_or_step === '3').map((e) => e.session_id)
    ).size;
    const step4 = new Set(
      filteredEvents.filter((e) => e.event_type === 'etape_formulaire' && e.page_or_step === '4').map((e) => e.session_id)
    ).size;
    const submitted = new Set(
      filteredEvents.filter((e) => e.event_type === 'formulaire_soumis').map((e) => e.session_id)
    ).size;

    const base = step1 || 1;

    return [
      {
        stepName: '1. Type de projet',
        visitors: step1,
        conversion: 100,
        dropRate: step1 > 0 ? Math.round(((step1 - step2) / step1) * 100) : 0,
      },
      {
        stepName: '2. Objectifs',
        visitors: step2,
        conversion: Math.round((step2 / base) * 100),
        dropRate: step2 > 0 ? Math.round(((step2 - step3) / step2) * 100) : 0,
      },
      {
        stepName: '3. Détails précis',
        visitors: step3,
        conversion: Math.round((step3 / base) * 100),
        dropRate: step3 > 0 ? Math.round(((step3 - step4) / step3) * 100) : 0,
      },
      {
        stepName: '4. Coordonnées',
        visitors: step4,
        conversion: Math.round((step4 / base) * 100),
        dropRate: step4 > 0 ? Math.round(((step4 - submitted) / step4) * 100) : 0,
      },
      {
        stepName: '✦ Demande soumise',
        visitors: submitted,
        conversion: Math.round((submitted / base) * 100),
        dropRate: 0,
      },
    ];
  }, [filteredEvents]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const barColors = ['#6600CC', '#7942D6', '#A78BFA', '#C69254'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-title font-semibold text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-amethyste" />
            <span>Statistiques de visite & comportement</span>
          </h2>
          <p className="text-xs text-ivoire-violet/70 font-body">
            Mesure anonyme et respectueuse de la vie privée (aucune donnée personnelle stockée)
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-ardoise/80 border border-violet-imperial/25 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all font-body ${
              timeRange === '7d'
                ? 'bg-violet-imperial text-white shadow-glow'
                : 'text-ivoire-violet/60 hover:text-white'
            }`}
          >
            7 derniers jours
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all font-body ${
              timeRange === '30d'
                ? 'bg-violet-imperial text-white shadow-glow'
                : 'text-ivoire-violet/60 hover:text-white'
            }`}
          >
            30 derniers jours
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all font-body ${
              timeRange === 'all'
                ? 'bg-violet-imperial text-white shadow-glow'
                : 'text-ivoire-violet/60 hover:text-white'
            }`}
          >
            Tout l'historique
          </button>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-1.5 rounded-xl text-ivoire-violet/60 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Actualiser les données"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ivoire-violet/60 font-body">
              Visiteurs uniques
            </span>
            <div className="p-2 rounded-xl bg-violet-imperial/20 text-amethyste">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-title font-bold text-white">
            {metrics.uniqueSessions}
          </div>
          <p className="text-[11px] text-ivoire-violet/50 font-body">Sessions anonymes sur la période</p>
        </div>

        <div className="p-5 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ivoire-violet/60 font-body">
              Pages vues
            </span>
            <div className="p-2 rounded-xl bg-violet-imperial/20 text-amethyste">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-title font-bold text-white">
            {metrics.totalPageViews}
          </div>
          <p className="text-[11px] text-ivoire-violet/50 font-body">Consultations totales de pages</p>
        </div>

        <div className="p-5 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ivoire-violet/60 font-body">
              Durée moyenne / page
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-title font-bold text-white">
            {formatSeconds(metrics.avgDurationSeconds)}
          </div>
          <p className="text-[11px] text-ivoire-violet/50 font-body">Temps d'attention moyen par visite</p>
        </div>

        <div className="p-5 rounded-3xl bg-ardoise/70 border border-violet-imperial/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ivoire-violet/60 font-body">
              Complétion Formulaire
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-title font-bold text-emerald-400">
            {metrics.completionRate}%
          </div>
          <p className="text-[11px] text-ivoire-violet/50 font-body">
            {metrics.submittedSessions} demande(s) / {metrics.step1Sessions} début(s)
          </p>
        </div>
      </div>

      {/* Row 1: Most Visited Pages & Average Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: Most Visited Pages */}
        <div className="p-6 rounded-3xl bg-ardoise/60 border border-violet-imperial/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-title font-semibold text-white">
                Pages les plus visitées
              </h3>
              <p className="text-xs text-ivoire-violet/60 font-body">
                Volume de consultations par page du site
              </p>
            </div>
            <span className="text-xs font-bold text-amethyste font-body">Vues</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pagesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-onyx border border-violet-imperial/30 p-3 rounded-2xl shadow-xl text-xs font-body space-y-1">
                          <p className="font-bold text-white">{data.name} ({data.path})</p>
                          <p className="text-amethyste">Vues : <strong>{data.views}</strong></p>
                          <p className="text-amber-300">Temps moyen : <strong>{formatSeconds(data.avgDuration)}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {pagesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table & Chart: Average Time Per Page */}
        <div className="p-6 rounded-3xl bg-ardoise/60 border border-violet-imperial/20 space-y-4">
          <div>
            <h3 className="text-base font-title font-semibold text-white">
              Temps moyen passé par page
            </h3>
            <p className="text-xs text-ivoire-violet/60 font-body">
              Degré d'intérêt et de lecture sur chaque section
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {pagesData.map((page, idx) => (
              <div
                key={page.path}
                className="p-3.5 rounded-2xl bg-onyx/60 border border-white/5 flex items-center justify-between gap-4 font-body"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: barColors[idx % barColors.length] }}
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block">{page.name}</span>
                    <span className="text-[11px] text-ivoire-violet/50">{page.path}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-amber-300 block font-mono">
                    {formatSeconds(page.avgDuration)}
                  </span>
                  <span className="text-[11px] text-ivoire-violet/50">{page.views} consultations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Contact Form Conversion Funnel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-ardoise/60 border border-violet-imperial/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-title font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amethyste" />
              <span>Entonnoir du formulaire de contact (Funnel)</span>
            </h3>
            <p className="text-xs text-ivoire-violet/60 font-body">
              Visualisez à quelle étape les visiteurs avancent ou abandonnent le formulaire
            </p>
          </div>
          <div className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold font-body self-start">
            Taux de conversion final : {metrics.completionRate}%
          </div>
        </div>

        {/* Funnel Progress Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {funnelData.map((step, idx) => {
            const isLast = idx === funnelData.length - 1;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all font-body relative ${
                  isLast
                    ? 'bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border-emerald-500/30'
                    : 'bg-onyx/70 border-violet-imperial/20'
                }`}
              >
                <div className="text-[11px] font-semibold text-ivoire-violet/70 mb-2 truncate">
                  {step.stepName}
                </div>
                
                <div className="text-2xl font-bold font-title text-white mb-1">
                  {step.visitors}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className={isLast ? 'text-emerald-400 font-bold' : 'text-amethyste font-semibold'}>
                    {step.conversion}%
                  </span>
                  {!isLast && step.dropRate > 0 && (
                    <span className="text-rose-400 font-mono text-[10px]">
                      -{step.dropRate}% abandon
                    </span>
                  )}
                </div>

                {/* Progress bar line */}
                <div className="w-full h-1.5 rounded-full bg-white/5 mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLast ? 'bg-emerald-400' : 'bg-gradient-to-r from-violet-imperial to-amethyste'
                    }`}
                    style={{ width: `${step.conversion}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
