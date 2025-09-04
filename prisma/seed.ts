import { PrismaClient, UserRole, ClientStatus, SessionStatus, SessionType, GoalStatus, MilestoneStatus, MetricFrequency, TaskPriority } from '../src/generated/prisma';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (dev only)
  await prisma.metricHistory.deleteMany();
  await prisma.goalMetric.deleteMany();
  await prisma.goalMilestone.deleteMany();
  await prisma.task.deleteMany();
  await prisma.session.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.threadParticipant.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.typingIndicator.deleteMany();
  await prisma.moderationReport.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.client.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const admin = await prisma.user.create({
    data: { email: 'admin@thrivecircle.com', name: 'Admin User', role: UserRole.admin, avatar: 'https://i.pravatar.cc/150?img=1' }
  });
  const coachUser = await prisma.user.create({
    data: { email: 'sarah@thrivecircle.com', name: 'Sarah Johnson', role: UserRole.coach, avatar: 'https://i.pravatar.cc/150?img=2' }
  });
  const clientUser = await prisma.user.create({
    data: { email: 'john@thrivecircle.com', name: 'John Smith', role: UserRole.client, avatar: 'https://i.pravatar.cc/150?img=3' }
  });

  // Coach
  const coach = await prisma.coach.create({
    data: {
      userId: coachUser.id,
      bio: 'Executive coach with 10+ years experience',
      specialties: ['leadership', 'communication'],
      isVerified: true,
      experience: 10,
      languages: ['en'],
    }
  });

  // Client
  const client = await prisma.client.create({
    data: {
      userId: clientUser.id,
      name: 'Acme Corporation',
      email: 'client@acme.com',
      company: 'Acme Corp',
      status: ClientStatus.active,
      coachId: coach.id,
      notes: ['Initial intake complete'],
    }
  });

  // Sessions
  await prisma.session.createMany({
    data: [
      { clientId: client.id, coachId: coach.id, date: new Date(), duration: 60, status: SessionStatus.completed, type: SessionType.initial },
      { clientId: client.id, coachId: coach.id, date: dayjs().add(7, 'day').toDate(), duration: 60, status: SessionStatus.scheduled, type: SessionType.follow_up },
    ]
  });

  // Goal
  const goal = await prisma.goal.create({
    data: {
      title: 'Improve Team Communication',
      description: 'Increase team sync efficiency and reduce meeting time',
      category: 'Communication',
      clientId: client.id,
      coachId: coach.id,
      targetDate: dayjs().add(30, 'day').toDate(),
      status: GoalStatus.active,
      progress: 30,
      successCriteria: ['Fewer misunderstandings', 'Shorter meetings'],
    }
  });

  // Milestones
  const ms1 = await prisma.goalMilestone.create({
    data: {
      goalId: goal.id,
      title: 'Run communication workshop',
      description: 'Conduct a 2-hour workshop with the team',
      targetDate: dayjs().add(10, 'day').toDate(),
      status: MilestoneStatus.in_progress,
      order: 1,
    }
  });
  await prisma.goalMilestone.create({
    data: {
      goalId: goal.id,
      title: 'Implement weekly async updates',
      description: 'Use async tools for weekly status updates',
      targetDate: dayjs().add(20, 'day').toDate(),
      status: MilestoneStatus.pending,
      order: 2,
    }
  });

  // Metrics
  const metric = await prisma.goalMetric.create({
    data: {
      goalId: goal.id,
      name: 'Meeting length (mins)',
      unit: 'mins',
      frequency: MetricFrequency.weekly,
      target: 30,
      currentValue: 45,
    }
  });
  await prisma.metricHistory.createMany({
    data: [
      { metricId: metric.id, value: 60, date: dayjs().subtract(2, 'week').toDate(), notes: 'Initial' },
      { metricId: metric.id, value: 45, date: dayjs().subtract(1, 'week').toDate(), notes: 'Better' },
    ]
  });

  // Tasks
  await prisma.task.createMany({
    data: [
      { title: 'Prepare workshop slides', description: 'Create deck', coachId: coach.id, clientId: client.id, goalId: goal.id, priority: TaskPriority.high },
      { title: 'Collect baseline data', clientId: client.id, goalId: goal.id, priority: TaskPriority.medium },
    ]
  });

  // Messages
  const thread = await prisma.messageThread.create({
    data: {
      subject: 'Kickoff',
      participants: {
        create: [
          { userId: coachUser.id },
          { userId: clientUser.id },
        ]
      }
    },
    include: { participants: true }
  });
  await prisma.message.createMany({
    data: [
      { threadId: thread.id, senderId: coachUser.id, content: 'Welcome to the program!' },
      { threadId: thread.id, senderId: clientUser.id, content: 'Thanks, excited to start.' },
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


