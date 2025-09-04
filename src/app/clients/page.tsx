"use client";
import React, { useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Paper, Select, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Chip, Avatar, Tooltip, IconButton } from '@mui/material';
// Using Box layout instead of Grid to avoid type issues
import { Search as SearchIcon, Add as AddIcon, Visibility as ViewIcon, Edit as EditIcon, Assessment as AssessmentIcon, Event as EventIcon, Task as TaskIcon, Message as MessageIcon, Business as BusinessIcon, TrendingUp as TrendingUpIcon, Schedule as ScheduleIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, Info as InfoIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/apiFetch';

const getStatusColor = (status: string) => (status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'default');
const getStatusIcon = (status: string) => (status === 'active' ? <CheckCircleIcon fontSize="small" /> : status === 'inactive' ? <WarningIcon fontSize="small" /> : <InfoIcon fontSize="small" />);

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', page, pageSize, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), ...(search && { q: search }), ...(statusFilter && { status: statusFilter }) });
      return (await apiFetch(`/api/clients?${params}`)).json();
    }
  });

  const clients = data?.data || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>Add Client</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{clients.filter((c: any) => c.status === 'active').length}</Typography>
                <Typography variant="body2">Active Clients</Typography>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{(data?.data || []).filter((c: any) => !!c.nextSession).length}</Typography>
                <Typography variant="body2">Upcoming Sessions</Typography>
              </Box>
              <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{clients.reduce((sum: number, c: any) => sum + (c.assessmentCount || 0), 0)}</Typography>
                <Typography variant="body2">Total Assessments</Typography>
              </Box>
              <AssessmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>${clients.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0).toLocaleString()}</Typography>
                <Typography variant="body2">Total Revenue</Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="All Clients" />
            <Tab label="Upcoming Sessions" />
            <Tab label="Recent Activity" />
          </Tabs>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField placeholder="Search clients..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} sx={{ minWidth: 300 }} />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {activeTab === 0 && (
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Coach</TableCell>
                    <TableCell>Program</TableCell>
                    <TableCell>Assessments</TableCell>
                    <TableCell>Sessions</TableCell>
                    <TableCell>Next Session</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client: any) => (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={client.avatar} alt={client.name}>{client.name?.charAt(0)}</Avatar>
                          <Box>
                            <Typography variant="subtitle2">{client.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{client.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{client.company}</TableCell>
                      <TableCell>
                        <Chip label={client.status} color={getStatusColor(client.status) as any} size="small" />
                      </TableCell>
                      <TableCell>{client.coachId ? `Coach ${client.coachId.split('-')[1] || ''}` : 'Unassigned'}</TableCell>
                      <TableCell>{client.programId ? `Program ${client.programId.split('-')[1] || ''}` : 'None'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssessmentIcon fontSize="small" color="primary" />
                          <Typography variant="body2">{client.assessmentCount || 0}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon fontSize="small" color="secondary" />
                          <Typography variant="body2">{client.sessionCount || 0}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {client.nextSession ? (
                          <Chip label={client.nextSession} size="small" color="info" variant="outlined" />
                        ) : (
                          <Typography variant="body2" color="text.secondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Client"><IconButton size="small" color="primary"><ViewIcon /></IconButton></Tooltip>
                          <Tooltip title="Edit Client"><IconButton size="small" color="secondary"><EditIcon /></IconButton></Tooltip>
                          <Tooltip title="Send Message"><IconButton size="small" color="info"><MessageIcon /></IconButton></Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {data?.pagination && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination count={data.pagination.totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" showFirstButton showLastButton />
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}


