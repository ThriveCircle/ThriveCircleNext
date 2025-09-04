"use client";
import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, Typography } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, isGhPages } from '@/lib/apiFetch';
import dayjs from 'dayjs';
import { useRightDrawer } from '../providers/RightDrawerProvider';

export default function TasksPage() {
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const queryClient = useQueryClient();
  const { openDrawer, closeDrawer } = useRightDrawer();

  const { data: goalsData } = useQuery({ queryKey: ['goals'], queryFn: async () => (await apiFetch('/api/goals')).json() });
  const goals = goalsData?.data || [];

  const updateGoalMutation = useMutation({
    mutationFn: async (goal: any) => (await apiFetch(`/api/goals/${goal.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(goal) })).json(),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['goals'] }); closeDrawer(); setEditingGoal(null); },
  });

  const renderGoalForm = (title: string) => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      {/* Keep brief form parity for demo */}
      <Button variant="contained" disabled={isGhPages} onClick={() => editingGoal && updateGoalMutation.mutate(editingGoal)}>Save</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Goals & Tasks Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingGoal({}); openDrawer(renderGoalForm('Create New Goal')); }}>Create New Goal</Button>
      </Box>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' } }}>
        {goals.map((goal: any) => (
          <Card key={goal.id} onClick={() => setSelectedGoal(goal)} sx={{ cursor: 'pointer' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Chip label={goal.status} size="small" />
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEditingGoal(goal); openDrawer(renderGoalForm('Edit Goal')); }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{goal.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{goal.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption">Progress</Typography>
                  <Typography variant="caption">{goal.progress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={goal.progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}


