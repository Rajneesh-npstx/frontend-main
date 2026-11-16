import { createCrudService } from './mockApi';
import { auditService } from './auditService';
import { seedNotificationCodeMasters, seedReminderCodeMasters } from '@/data/masters';
import { STORAGE_KEYS } from './storage';
import type { NotificationCodeMaster, ReminderCodeMaster } from '@/types';

const notificationCrud = createCrudService<NotificationCodeMaster>(STORAGE_KEYS.notificationCodeMasters, seedNotificationCodeMasters);
const reminderCrud = createCrudService<ReminderCodeMaster>(STORAGE_KEYS.reminderCodeMasters, seedReminderCodeMasters);

export const masterDataService = {
  listNotificationCodes: notificationCrud.list,
  createNotificationCode(input: Omit<NotificationCodeMaster, 'id'>): NotificationCodeMaster {
    if (notificationCrud.list().some((item) => item.appId === input.appId && item.code.toLowerCase() === input.code.toLowerCase())) {
      throw new Error('Notification code must be unique within the application');
    }
    const item = notificationCrud.create(input);
    auditService.log('Notifications', `Created notification code "${item.code}"`, item.appId);
    return item;
  },
  listReminderCodes: reminderCrud.list,
  createReminderCode(input: Omit<ReminderCodeMaster, 'id'>): ReminderCodeMaster {
    if (reminderCrud.list().some((item) => item.appId === input.appId && item.code.toLowerCase() === input.code.toLowerCase())) {
      throw new Error('Reminder code must be unique within the application');
    }
    const item = reminderCrud.create(input);
    auditService.log('Reminders', `Created reminder code "${item.code}"`, item.appId);
    return item;
  },
};
