import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';

@Entity('chat_messages')
@Index(['conversationId', 'createdAt'])
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'conversation_id' })
    conversationId: string;

    @ManyToOne(() => ChatConversation)
    @JoinColumn({ name: 'conversation_id' })
    conversation: ChatConversation;

    @Column()
    role: 'user' | 'assistant';

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
