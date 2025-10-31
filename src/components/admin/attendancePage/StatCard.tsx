"use client";
import React from "react";

type Color = 'blue' | 'green' | 'orange' | 'gray';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  color: Color;
}

const colorClasses: Record<Color, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  gray: 'bg-gray-100 text-gray-600',
};

export default function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
