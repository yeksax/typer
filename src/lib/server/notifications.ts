import { prisma } from "$lib/prisma";
import type { _Notification } from "$lib/types";
import type { NotificationAction, Preferences } from "@prisma/client";
import type Pusher from "pusher";

interface NotifierConstructor {
  actors: { id: string }[];
  action: NotificationAction;
  redirect: string;
  reference: string;
  title: string;
  text?: string;
  icon?: string;
}

export class Notifier {
  public notify: Pusher;
  public target: { id: string };
  private preferences: Preferences | null = null;
  private action: "new" | "delete" | "additive_update" | "destructive_update" = "new";

  constructor(pusher: Pusher, target: { id: string }) {
    this.notify = pusher;
    this.target = target;

    prisma.preferences
      .findUnique({
        where: {
          userId: this.target.id,
        },
      })
      .then((preferences) => {
        this.preferences = preferences;
      });
  }

  async emitNotification(notification: any) {
    this.notify.trigger(
      `user__${this.target.id}`,
      `${this.action}-notification`,
      notification
    );
  }

  async removeParticipation(reference: string, actors: { id: string }[]) {
    const isSelf = actors.length === 1 && this.target.id === actors[0].id;
    if (isSelf) return;

    try {
      const notification = await prisma.notification.update({
        where: {
          id: reference,
        },
        data: {
          notificationActors: {
            disconnect: actors,
          },
        },
        include: {
          notificationActors: {
            select: {
              avatar: true,
              username: true,
              name: true,
              tag: true,
              banner: true,
              biography: true,
              displayName: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                },
              },
            },
          },
          _count: {
            select: {
              notificationActors: true,
            },
          },
        },
      });

      if (notification._count.notificationActors === 0) {
        this.action = "delete";
        this.emitNotification(
          await prisma.notification.delete({
            where: {
              id: reference,
            },
          })
        );
      } else {
        this.action = "destructive_update";
        this.emitNotification(notification);
      }
    } catch (e) {
      return;
    }
  }

  async handle({
    text,
    action,
    title,
    redirect,
    actors,
    icon,
    reference,
  }: NotifierConstructor) {
    const isSelf = actors.length === 1 && this.target.id === actors[0].id;
    if (isSelf) return;

    actors = actors.filter((a) => a.id !== this.target.id);
    const notificationExists = await prisma.notification.findFirst({
      where: {
        id: reference,
      },
    });

    if (notificationExists) this.action = "additive_update";

    const notification = await prisma.notification.upsert({
      where: {
        id: reference,
      },
      create: {
        id: reference,
        text,
        action,
        title,
        redirect,
        icon,
        notificationReceiver: {
          connect: this.target,
        },
        notificationActors: {
          connect: actors,
        },
      },
      update: {
        isRead: false,
        notificationActors: {
          connect: actors,
        },
      },
      include: {
        notificationActors: {
          select: {
            avatar: true,
            username: true,
            name: true,
            tag: true,
            banner: true,
            biography: true,
            displayName: true,
            _count: {
              select: {
                followers: true,
                following: true,
              },
            },
          },
        },
        notificationReceiver: {
          include: {
            preferences: true,
          },
        },
      },
    });

    this.emitNotification(notification);
  }
}
