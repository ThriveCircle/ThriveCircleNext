"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Card, CardContent, Typography, Avatar, Paper, IconButton, Chip, TextField, Button } from '@mui/material';
import { Download as DownloadIcon, AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: thread } = useQuery({ queryKey: ['message-thread', id], queryFn: async () => (await fetch(`/api/message-threads/${id}`)).json(), enabled: !!id });
  const { data: messagesData } = useQuery({ queryKey: ['messages', id], queryFn: async () => (await fetch(`/api/messages?threadId=${id}`)).json(), enabled: !!id, refetchInterval: 3000 });
  const messages = messagesData?.data || [];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messagesData]);

  const uploadAttachmentMutation = useMutation({
    mutationFn: async (file: File) => (await fetch('/api/attachments/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : file.type.startsWith('video/') ? 'video' : 'document', size: file.size, mimeType: file.type }) })).json()
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => (await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messageData) })).json(),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['messages', id] }); setNewMessage(''); setSelectedFiles([]); },
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    const messageData: any = { threadId: id, senderId: 'user-1', content: newMessage.trim(), attachments: [] };
    for (const file of selectedFiles) {
      const attachment = await uploadAttachmentMutation.mutateAsync(file);
      messageData.attachments.push(attachment.id);
    }
    sendMessageMutation.mutate(messageData);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>{thread?.subject}</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {thread?.isMuted && <Chip label="Muted" size="small" color="warning" />}
                {thread?.isArchived && <Chip label="Archived" size="small" color="default" />}
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => fetch('/api/messages/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ threadId: id }) })}>Export to PDF</Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, height: '60vh', overflow: 'auto' }}>
        <CardContent>
          {messages.map((m: any) => (
            <Box key={m.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: m.senderId === 'user-1' ? 'flex-end' : 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{m.senderId === 'user-1' ? 'U' : 'C'}</Avatar>
                <Typography variant="caption" color="text.secondary">{dayjs(m.createdAt).format('MMM D, h:mm A')}</Typography>
              </Box>
              <Paper sx={{ p: 2, maxWidth: '70%', backgroundColor: m.senderId === 'user-1' ? 'primary.main' : 'grey.100', color: m.senderId === 'user-1' ? 'white' : 'text.primary' }}>
                <Typography variant="body1">{m.content}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField fullWidth multiline rows={3} placeholder="Type your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <input type="file" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))} />
            <IconButton onClick={() => fileInputRef.current?.click()} color="primary"><AttachFileIcon /></IconButton>
            <Button variant="contained" onClick={handleSendMessage} disabled={!newMessage.trim() && selectedFiles.length === 0}><SendIcon /></Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}


