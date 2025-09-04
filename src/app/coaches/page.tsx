"use client";
import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

export default function CoachesPage() {
  const { data } = useQuery({ queryKey: ['coaches'], queryFn: async () => (await fetch('/api/coaches')).json() });
  const coaches = data?.data || [];
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Coaches</Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
        {coaches.map((c: any) => (
          <Card key={c.id}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={c.user?.avatar}>{c.user?.name?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="subtitle1">{c.user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{c.user?.email}</Typography>
                </Box>
              </Box>
              {c.isVerified && <Chip label="Verified" size="small" color="success" sx={{ mt: 1 }} />}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}


