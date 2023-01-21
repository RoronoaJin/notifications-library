import { Notification, NotificationCenterConfig, SubscribeCallback } from "./types";

const { v4: uuidv4 } = require('uuid');

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

    async getNotifications(): Promise<Notification[]> {
        if (this.config) {
            try {
                const response = await fetch(this.config.fetchUrl);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                this.notificationsList = data;
            } catch (error) {
                console.error(error);
            }
        }
        return this.notificationsList;
    }

    async getNotificationByID(id: string): Promise<Notification | null> {
        if (!id) {
            throw new Error('Invalid ID');
        }
        const notifications = await this.getNotifications();
        return notifications.find(notification => notification.id === id) || null;
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
            try {
                const response = await fetch(this.config.createUrl, {
                    method: 'POST',
                    body: JSON.stringify(newNotification),
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            } catch (error) {
                console.error(error);
            }
        }
        this.notificationsList.push(newNotification);
        this.notifySubscribers(newNotification);
        return newNotification;
    }

    async setRead(id: string): Promise<void> {
        if (!id) {
            throw new Error('Invalid ID');
        }
        try {
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
        } catch (error) {
            console.error(error);
        }
    }

    async markAllAsRead(): Promise<void> {
        try {
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
            });
        } catch (error) {
            console.error(error);
        }
    }

    async deleteNotificationByID(id: string): Promise<void> {
        if (!id) {
            throw new Error('Invalid ID');
        }
        try {
            if (this.config) {
                const response = await fetch(`${this.config.updateUrl}/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            }
            this.notificationsList = this.notificationsList.filter(notification => notification.id !== id);
        } catch (error) {
            console.error(error);
        }
    }

    async deleteAllNotifications(): Promise<void> {
        try {
            if (this.config) {
                const response = await fetch(this.config.updateUrl, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            }
            this.notificationsList = [];
        } catch (error) {
            console.error(error);
        }
    }
}