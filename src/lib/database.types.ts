export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _ChatToUser: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_ChatToUser_A_fkey"
            columns: ["A"]
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_ChatToUser_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _deletedMessage: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_deletedMessage_A_fkey"
            columns: ["A"]
            referencedRelation: "Message"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_deletedMessage_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _FixedChat: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_FixedChat_A_fkey"
            columns: ["A"]
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_FixedChat_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _Friends: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_Friends_A_fkey"
            columns: ["A"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_Friends_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _LikedBy: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_LikedBy_A_fkey"
            columns: ["A"]
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_LikedBy_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _NotificationActorsToUser: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_NotificationActorsToUser_A_fkey"
            columns: ["A"]
            referencedRelation: "NotificationActors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_NotificationActorsToUser_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _readMessages: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_readMessages_A_fkey"
            columns: ["A"]
            referencedRelation: "Message"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_readMessages_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _SilencedChat: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_SilencedChat_A_fkey"
            columns: ["A"]
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_SilencedChat_B_fkey"
            columns: ["B"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      _Thread: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_Thread_A_fkey"
            columns: ["A"]
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_Thread_B_fkey"
            columns: ["B"]
            referencedRelation: "Post"
            referencedColumns: ["id"]
          }
        ]
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Chat: {
        Row: {
          createdAt: string
          description: string
          id: string
          name: string
          ownerId: string | null
          thumbnail: string
          type: Database["public"]["Enums"]["ChatType"]
          updatedAt: string
          verified: boolean | null
        }
        Insert: {
          createdAt?: string
          description: string
          id: string
          name: string
          ownerId?: string | null
          thumbnail?: string
          type: Database["public"]["Enums"]["ChatType"]
          updatedAt: string
          verified?: boolean | null
        }
        Update: {
          createdAt?: string
          description?: string
          id?: string
          name?: string
          ownerId?: string | null
          thumbnail?: string
          type?: Database["public"]["Enums"]["ChatType"]
          updatedAt?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "Chat_ownerId_fkey"
            columns: ["ownerId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      DirectMessageRequest: {
        Row: {
          id: string
          originId: string
          receiverId: string
        }
        Insert: {
          id: string
          originId: string
          receiverId: string
        }
        Update: {
          id?: string
          originId?: string
          receiverId?: string
        }
        Relationships: [
          {
            foreignKeyName: "DirectMessageRequest_originId_fkey"
            columns: ["originId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DirectMessageRequest_receiverId_fkey"
            columns: ["receiverId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      EditedMessage: {
        Row: {
          content: string
          id: string
          messageId: string | null
        }
        Insert: {
          content: string
          id: string
          messageId?: string | null
        }
        Update: {
          content?: string
          id?: string
          messageId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "EditedMessage_messageId_fkey"
            columns: ["messageId"]
            referencedRelation: "Message"
            referencedColumns: ["id"]
          }
        ]
      }
      File: {
        Row: {
          editedMessageId: string | null
          id: string
          messageId: string | null
          name: string
          postId: string | null
          size: number
          url: string
        }
        Insert: {
          editedMessageId?: string | null
          id: string
          messageId?: string | null
          name: string
          postId?: string | null
          size: number
          url: string
        }
        Update: {
          editedMessageId?: string | null
          id?: string
          messageId?: string | null
          name?: string
          postId?: string | null
          size?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "File_editedMessageId_fkey"
            columns: ["editedMessageId"]
            referencedRelation: "EditedMessage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "File_messageId_fkey"
            columns: ["messageId"]
            referencedRelation: "Message"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "File_postId_fkey"
            columns: ["postId"]
            referencedRelation: "Post"
            referencedColumns: ["id"]
          }
        ]
      }
      Message: {
        Row: {
          audio: string | null
          authorId: string
          chatId: string
          content: string
          createdAt: string
          id: string
          isDeleted: boolean
          mentionId: string | null
          updatedAt: string
        }
        Insert: {
          audio?: string | null
          authorId: string
          chatId: string
          content?: string
          createdAt?: string
          id: string
          isDeleted?: boolean
          mentionId?: string | null
          updatedAt: string
        }
        Update: {
          audio?: string | null
          authorId?: string
          chatId?: string
          content?: string
          createdAt?: string
          id?: string
          isDeleted?: boolean
          mentionId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Message_authorId_fkey"
            columns: ["authorId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_chatId_fkey"
            columns: ["chatId"]
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Message_mentionId_fkey"
            columns: ["mentionId"]
            referencedRelation: "Message"
            referencedColumns: ["id"]
          }
        ]
      }
      Notification: {
        Row: {
          action: Database["public"]["Enums"]["NotificationAction"]
          createdAt: string
          icon: string | null
          id: string
          isRead: boolean
          receiverId: string
          redirect: string
          text: string
          title: string
          updatedAt: string
        }
        Insert: {
          action?: Database["public"]["Enums"]["NotificationAction"]
          createdAt?: string
          icon?: string | null
          id: string
          isRead?: boolean
          receiverId: string
          redirect: string
          text: string
          title: string
          updatedAt: string
        }
        Update: {
          action?: Database["public"]["Enums"]["NotificationAction"]
          createdAt?: string
          icon?: string | null
          id?: string
          isRead?: boolean
          receiverId?: string
          redirect?: string
          text?: string
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notification_receiverId_fkey"
            columns: ["receiverId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      NotificationActors: {
        Row: {
          id: string
          notificationId: string
        }
        Insert: {
          id: string
          notificationId: string
        }
        Update: {
          id?: string
          notificationId?: string
        }
        Relationships: [
          {
            foreignKeyName: "NotificationActors_notificationId_fkey"
            columns: ["notificationId"]
            referencedRelation: "Notification"
            referencedColumns: ["id"]
          }
        ]
      }
      Post: {
        Row: {
          content: string
          createdAt: string
          deleted: boolean
          id: string
          repliedId: string | null
          repostId: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          deleted?: boolean
          id: string
          repliedId?: string | null
          repostId?: string | null
          updatedAt?: string
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          deleted?: boolean
          id?: string
          repliedId?: string | null
          repostId?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Post_repliedId_fkey"
            columns: ["repliedId"]
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Post_repostId_fkey"
            columns: ["repostId"]
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Post_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Preferences: {
        Row: {
          allowDMNotifications: boolean
          allowDMRequests: Database["public"]["Enums"]["DMRequests"]
          allowFollowNotifications: boolean
          allowLikeNotifications: boolean
          allowPushNotifications: boolean
          allowReplyNotifications: boolean
          allowSensitiveContent: boolean
          id: string
          theme: Database["public"]["Enums"]["Theme"]
          userId: string
        }
        Insert: {
          allowDMNotifications?: boolean
          allowDMRequests?: Database["public"]["Enums"]["DMRequests"]
          allowFollowNotifications?: boolean
          allowLikeNotifications?: boolean
          allowPushNotifications?: boolean
          allowReplyNotifications?: boolean
          allowSensitiveContent?: boolean
          id: string
          theme?: Database["public"]["Enums"]["Theme"]
          userId: string
        }
        Update: {
          allowDMNotifications?: boolean
          allowDMRequests?: Database["public"]["Enums"]["DMRequests"]
          allowFollowNotifications?: boolean
          allowLikeNotifications?: boolean
          allowPushNotifications?: boolean
          allowReplyNotifications?: boolean
          allowSensitiveContent?: boolean
          id?: string
          theme?: Database["public"]["Enums"]["Theme"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Preferences_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          pushSubscription: Json | null
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          pushSubscription?: Json | null
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          pushSubscription?: Json | null
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      User: {
        Row: {
          avatar: string
          banner: string
          biography: string
          birthdate: string | null
          canReceiveDM: Database["public"]["Enums"]["DMRequests"]
          createdAt: string
          displayName: string | null
          email: string
          emailVerified: string | null
          id: string
          links: string[] | null
          name: string
          pinnedPostId: string | null
          tag: string
          username: string
        }
        Insert: {
          avatar?: string
          banner?: string
          biography?: string
          birthdate?: string | null
          canReceiveDM?: Database["public"]["Enums"]["DMRequests"]
          createdAt?: string
          displayName?: string | null
          email: string
          emailVerified?: string | null
          id: string
          links?: string[] | null
          name: string
          pinnedPostId?: string | null
          tag: string
          username: string
        }
        Update: {
          avatar?: string
          banner?: string
          biography?: string
          birthdate?: string | null
          canReceiveDM?: Database["public"]["Enums"]["DMRequests"]
          createdAt?: string
          displayName?: string | null
          email?: string
          emailVerified?: string | null
          id?: string
          links?: string[] | null
          name?: string
          pinnedPostId?: string | null
          tag?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_pinnedPostId_fkey"
            columns: ["pinnedPostId"]
            referencedRelation: "Post"
            referencedColumns: ["id"]
          }
        ]
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ChatType: "DIRECT_MESSAGE" | "GROUP_CHAT"
      DMRequests: "NOT_ALLOWED" | "FOLLOWING_ONLY" | "ALLOWED"
      NotificationAction: "REPLY" | "LIKE" | "FOLLOW" | "GENERIC"
      Theme: "LIGHT" | "DARK" | "SYSTEM_DEFAULT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
