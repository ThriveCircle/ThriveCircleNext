"use client";
import React, { useMemo, useState } from 'react';
import { AppBar, Avatar, Box, Chip, CssBaseline, Drawer, FormControl, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Select, Toolbar, Typography, Collapse, useMediaQuery, useTheme } from '@mui/material';
import { Dashboard as DashboardIcon, Assessment as AssessmentIcon, SmartToy as SmartToyIcon, Settings as SettingsIcon, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Business as BusinessIcon, People as PeopleIcon, Psychology as PsychologyIcon, School as SchoolIcon, Event as EventIcon, Task as TaskIcon, Chat as ChatIcon, Receipt as ReceiptIcon, BarChart as BarChartIcon, AdminPanelSettings as AdminIcon, Person as PersonIcon } from '@mui/icons-material';
import Link from 'next/link';
import { UserProvider } from './providers/UserContext';
import { RightDrawerProvider } from './providers/RightDrawerProvider';

const logoDataUrl = "data:image/svg+xml;base64," + btoa(`
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#6750A4" stroke="#B69DF8" stroke-width="2"/>
  <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">TC</text>
</svg>
`);

const drawerWidth = 280;
const collapsedDrawerWidth = 72;

const navigationItems = [
  { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/clients", label: "Clients", icon: <PeopleIcon /> },
  { path: "/coaches", label: "Coaches", icon: <PsychologyIcon /> },
  { path: "/programs", label: "Programs", icon: <SchoolIcon /> },
  { path: "/assessments", label: "Assessments", icon: <AssessmentIcon /> },
  { path: "/sessions", label: "Sessions", icon: <EventIcon /> },
  { path: "/tasks", label: "Tasks", icon: <TaskIcon /> },
  { path: "/messages", label: "Messages", icon: <ChatIcon /> },
  { path: "/billing", label: "Billing", icon: <ReceiptIcon /> },
  { path: "/reports", label: "Reports", icon: <BarChartIcon /> },
  { path: "/ai-coach", label: "AI Coach", icon: <SmartToyIcon /> },
  { path: "/settings", label: "Settings", icon: <SettingsIcon /> },
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<"admin" | "coach" | "client">("admin");
  const [currentCoachId, setCurrentCoachId] = useState<string | undefined>(undefined);
  const [currentClientId, setCurrentClientId] = useState<string | undefined>(undefined);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [currentUser, setCurrentUser] = useState({
    name: "Admin User",
    email: "admin@thrivecircle.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "admin" as const,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleRoleSwitch = (role: "admin" | "coach" | "client") => {
    setUserRole(role);
    const roleUsers = {
      admin: { name: "Admin User", email: "admin@thrivecircle.com", avatar: "https://i.pravatar.cc/150?img=1", role: "admin" as const },
      coach: { name: "Sarah Johnson", email: "sarah@thrivecircle.com", avatar: "https://i.pravatar.cc/150?img=2", role: "coach" as const },
      client: { name: "John Smith", email: "john@thrivecircle.com", avatar: "https://i.pravatar.cc/150?img=3", role: "client" as const },
    };
    setCurrentUser(roleUsers[role]);
    if (role === "coach") { setCurrentCoachId("coach-1"); setCurrentClientId(undefined); }
    else if (role === "client") { setCurrentClientId("client-1"); setCurrentCoachId(undefined); }
    else { setCurrentCoachId(undefined); setCurrentClientId(undefined); }
    setUserMenuAnchor(null);
  };

  const mockClients = [
    { id: "client-1", name: "Acme Corporation", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: "client-2", name: "TechStart Inc", avatar: "https://i.pravatar.cc/150?img=2" },
  ];

  const visibleNavItems = useMemo(() => navigationItems, []);

  const drawer = (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Collapse in={!isMobile && !drawerCollapsed} orientation="horizontal">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img src={logoDataUrl} alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h6" noWrap component="div" sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
              Thrive Circle
            </Typography>
          </Box>
        </Collapse>
        <IconButton onClick={isMobile ? handleDrawerToggle : () => setDrawerCollapsed(!drawerCollapsed)} size="small" sx={{ color: '#FFFFFF' }}>
          {isMobile ? <ChevronLeftIcon /> : (drawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />)}
        </IconButton>
      </Toolbar>
      <List>
        {visibleNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Link href={item.path} style={{ width: '100%' }}>
              <ListItemButton sx={{ borderRadius: 2, mx: 1, minHeight: 48 }}>
                <ListItemIcon sx={{ color: '#FFFFFF', minWidth: isMobile ? 40 : (drawerCollapsed ? 0 : 40) }}>
                  {item.icon}
                </ListItemIcon>
                <Collapse in={!isMobile && !drawerCollapsed} orientation="horizontal">
                  <ListItemText primary={item.label} />
                </Collapse>
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)` }, ml: { md: `${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select value={selectedClient} onChange={(e) => { setSelectedClient(e.target.value); setCurrentClientId(e.target.value || undefined); }} displayEmpty>
                <MenuItem value="">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                    <BusinessIcon sx={{ fontSize: 20 }} />
                    <Typography>All Clients</Typography>
                  </Box>
                </MenuItem>
                {mockClients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    <Avatar src={client.avatar} sx={{ width: 20, height: 20, mr: 1 }} />
                    <Typography>{client.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label={userRole.toUpperCase()} size="small" color="secondary" />
            <IconButton size="large" onClick={handleUserMenuOpen} color="inherit">
              <Avatar src={currentUser.avatar} sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerCollapsed ? collapsedDrawerWidth : drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: { xs: '100%', sm: drawerWidth } } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: drawerCollapsed ? collapsedDrawerWidth : drawerWidth, overflowX: 'hidden' } }} open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)` }, mt: '64px' }}>
        <UserProvider value={{ role: userRole, setRole: setUserRole, currentCoachId, setCurrentCoachId, currentClientId, setCurrentClientId }}>
          <RightDrawerProvider>
            {children}
          </RightDrawerProvider>
        </UserProvider>
      </Box>

      <Menu id="user-menu" anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={handleUserMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={currentUser.avatar} sx={{ mr: 2, width: 40, height: 40 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{currentUser.name}</Typography>
              <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
            </Box>
          </Box>
          <Chip label={(currentUser.role as string).toUpperCase()} color="primary" size="small" icon={currentUser.role === 'admin' ? <AdminIcon /> : currentUser.role === 'coach' ? <PsychologyIcon /> : <PersonIcon />} />
        </Box>
        <MenuItem onClick={() => handleRoleSwitch('admin')}>Switch to Admin</MenuItem>
        <MenuItem onClick={() => handleRoleSwitch('coach')}>Switch to Coach</MenuItem>
        <MenuItem onClick={() => handleRoleSwitch('client')}>Switch to Client</MenuItem>
      </Menu>
    </Box>
  );
};


