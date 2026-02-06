"use client";

import { Download, Upload, Globe, Activity, Server, Route } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatBytes } from "@/lib/utils";
import type { StatsSummary } from "@clashmaster/shared";

interface StatsCardsProps {
  data: StatsSummary | null;
  error?: string | null;
}

function StatCard({
  value,
  label,
  subvalue,
  icon: Icon,
  color,
}: {
  value: number | string;
  label: string;
  subvalue?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl p-4 border bg-card flex flex-col">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium truncate">
          {label}
        </p>
        <p className="text-xl font-bold mt-1 tabular-nums truncate" title={String(value)}>
          {value}
        </p>
        {subvalue && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {subvalue}
          </p>
        )}
      </div>
    </div>
  );
}

function CircularProgressCard({
  value,
  max,
  icon: Icon,
  label,
  color,
}: {
  value: number;
  max: number;
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  const radius = 28;
  const strokeWidth = 4;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;
  const size = 64;

  return (
    <div className="rounded-xl p-4 border bg-card flex flex-col">
      <div className="mb-3">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-muted/15"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium truncate">
          {label}
        </p>
        <p className="text-xl font-bold mt-1 tabular-nums truncate" title={formatBytes(value)}>
          {formatBytes(value)}
        </p>
      </div>
    </div>
  );
}

function TodayCard({
  download,
  upload,
  title,
  downloadLabel,
  uploadLabel,
}: {
  download: number;
  upload: number;
  title: string;
  downloadLabel: string;
  uploadLabel: string;
}) {
  return (
    <div className="rounded-xl p-4 border bg-card flex flex-col">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: "#10B98115" }}
      >
        <Activity className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="flex-1">
        <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium">
          {title}
        </p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground truncate">{downloadLabel}</span>
            <span className="text-sm font-semibold tabular-nums truncate">
              {formatBytes(download)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground truncate">{uploadLabel}</span>
            <span className="text-sm font-semibold tabular-nums truncate">
              {formatBytes(upload)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatsCards({ data }: StatsCardsProps) {
  const t = useTranslations("stats");
  const maxTraffic = Math.max(
    data?.totalDownload || 0,
    data?.totalUpload || 0,
    1
  );

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      <CircularProgressCard
        value={data?.totalDownload || 0}
        max={maxTraffic * 1.2}
        icon={Download}
        label={t("totalDownload")}
        color="#3B82F6"
      />
      <CircularProgressCard
        value={data?.totalUpload || 0}
        max={maxTraffic * 1.2}
        icon={Upload}
        label={t("totalUpload")}
        color="#8B5CF6"
      />
      <TodayCard
        download={data?.todayDownload || 0}
        upload={data?.todayUpload || 0}
        title={t("today")}
        downloadLabel={t("download")}
        uploadLabel={t("upload")}
      />
      <StatCard
        value={(data?.totalDomains || 0).toLocaleString()}
        label={t("domains")}
        icon={Globe}
        color="#06B6D4"
      />
      <StatCard
        value={(data?.totalRules || 0).toLocaleString()}
        label={t("rules")}
        subvalue={t("tracked")}
        icon={Route}
        color="#F59E0B"
      />
      <StatCard
        value={formatBytes((data?.totalDownload || 0) + (data?.totalUpload || 0))}
        label={t("total")}
        subvalue={`${(data?.totalDomains || 0)} ${t("tracked")}`}
        icon={Server}
        color="#EC4899"
      />
    </div>
  );
}
