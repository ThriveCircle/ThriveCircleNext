"use client";
import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, People as PeopleIcon, Event as EventIcon, AttachMoney as MoneyIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const clientStatusData = [
  { name: 'Active', value: 24, color: '#6750A4' },
  { name: 'Inactive', value: 4, color: '#B69DF8' },
  { name: 'Archived', value: 2, color: '#938F99' },
];

const KPICard: React.FC<{ title: string; value: string | number; trend?: number; icon: React.ReactNode; color: string; }> = ({ title, value, trend, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" color="text.secondary">{title}</Typography>
        <Avatar sx={{ background: color, width: 56, height: 56 }}>{icon}</Avatar>
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>{value}</Typography>
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend > 0 ? <TrendingUpIcon color="success" fontSize="small" /> : <TrendingDownIcon color="error" fontSize="small" />}
          <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
            {Math.abs(trend)}% from last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ['dashboard-summary'], queryFn: async () => (await fetch('/api/dashboard/summary')).json() });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, mb: 4 }}>
        <KPICard title="Active Clients" value={data?.activeClients || 0} trend={12} icon={<PeopleIcon />} color="#6750A4" />
        <KPICard title="Completion Rate" value={`${data?.completionRate || 0}%`} trend={8} icon={<CheckIcon />} color="#B69DF8" />
        <KPICard title="Upcoming Sessions" value={data?.upcomingSessions || 0} trend={8} icon={<EventIcon />} color="#10B981" />
        <KPICard title="Revenue MTD" value={`$${(data?.revenueMTD || 0).toLocaleString()}`} trend={15} icon={<MoneyIcon />} color="#F59E0B" />
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Revenue Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6750A4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Client Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={clientStatusData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                  {clientStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}


