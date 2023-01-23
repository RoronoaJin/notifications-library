import { Notification, NotificationCenterConfig, SubscribeCallback } from "./types";

import { v4 as uuidv4 } from 'uuid';

export class NotificationCenter {

    private config: NotificationCenterConfig | undefined;
    private notificationSender: string;
    notificationsList: Notification[];
    subscribers: SubscribeCallback[];

    constructor() {
        this.notificationsList = [];
        this.subscribers = [];
        this.notificationSender = 'defaultSender';
    }

    setConfig(config: NotificationCenterConfig): void {
        this.config = config;
    }

    getConfig(): NotificationCenterConfig | undefined {
        return this.config;
    }

    setSender(senderName: string): void {
        this.notificationSender = senderName;
    }

    addSubscriber(callback: SubscribeCallback): void {
        this.subscribers.push(callback);
    }

    notifySubscribers(notification: Notification): void {
        this.subscribers.forEach(callback => callback(notification));
    }

    async getAllNotifications(): Promise<Notification[]> {
        if (this.config) {
            const response = await fetch(this.config.fetchUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            this.notificationsList = data;
        }
        return this.notificationsList;
    }

    async getNotificationByID(id: string): Promise<Notification | null> {
        if (!id) {
            throw new Error('Invalid ID');
        }
        if (this.config) {
            const response = await fetch(`${this.config.updateUrl}/${id}`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }
        const notification = this.notificationsList.find(notification => notification.id === id) || null;
        if (!notification) {
            throw new Error('Notification not found');
        }
        else {
            return notification;
        }
    }

    async sendNotification(notificationData: any): Promise<Notification> {
        const newNotification: Notification = {
            id: uuidv4(),
            data: notificationData,
            sender: this.notificationSender,
            createdAt: Date.now(),
            readAt: undefined
        };

        if (this.config) {
            const response = await fetch(this.config.createUrl, {
                method: 'POST',
                body: JSON.stringify(newNotification),
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }
        this.notificationsList.push(newNotification);
        this.notifySubscribers(newNotification);
        return newNotification;
    }

    async setNotficationAsRead(id: string): Promise<void> {
        if (!id) {
            throw new Error('Invalid ID');
        }
        if (this.config) {
            const response = await fetch(`${this.config.updateUrl}/${id}`, { method: 'PUT' });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }
        const notification = this.notificationsList.find(notification => notification.id === id);
        if (notification) {
            notification.readAt = Date.now();
            this.notifySubscribers(notification);
        }
        else {
            throw new Error('Notification not found');
        }
    }

    async markAllAsRead(): Promise<void> {
        if (this.config) {
            const response = await fetch(`${this.config.updateUrl}`, { method: 'PUT' });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }
        this.notificationsList.forEach(notification => {
            if (!notification.readAt) {
                notification.readAt = Date.now();
            }
            else {
                throw new Error('All the notifications are marked as read');
            }
        });
    }

    async deleteNotificationByID(id: string): Promise<void> {
        if (!id) {
            throw new Error('Invalid ID');
        }
        if (this.config) {
            const response = await fetch(`${this.config.updateUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }
        this.notificationsList = this.notificationsList.filter(notification => notification.id !== id);
    }

    async deleteAllNotifications(): Promise<void> {
        if (this.config) {
            const response = await fetch(this.config.updateUrl, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        }
        this.notificationsList = [];
    }
}