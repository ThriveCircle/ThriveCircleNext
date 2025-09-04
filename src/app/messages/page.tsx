"use client";
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, InputAdornment, List, ListItem, ListItemAvatar, Avatar, Badge, ListItemText, IconButton, Chip } from '@mui/material';
import { Search as SearchIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['message-threads'], queryFn: async () => (await fetch('/api/message-threads')).json() });
  const threads = (data?.data || []).filter((t: any) => !searchQuery || t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Messages</Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Conversations</Typography>
            <TextField size="small" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
          </Box>
          {isLoading ? <Typography>Loading...</Typography> : (
            <List>
              {threads.map((thread: any) => (
                <ListItem key={thread.id} sx={{ border: '1px solid #E7E0EC', borderRadius: 2, mb: 1 }}>
                  <ListItemAvatar>
                    <Badge badgeContent={thread.unreadCount} color="primary" invisible={thread.unreadCount === 0}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{thread.subject?.charAt(0)}</Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{thread.subject}</Typography><Chip label={thread.retentionPolicy} size="small" color="secondary" variant="outlined" /></Box>} secondary={<Box><Typography variant="body2" color="text.secondary" noWrap>{thread.lastMessage?.content}</Typography><Typography variant="caption" color="text.secondary">{dayjs(thread.updatedAt).fromNow()}</Typography></Box>} />
                  <IconButton><MoreVertIcon /></IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}


