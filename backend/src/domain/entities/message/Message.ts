import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Id } from '../../value-objects/Id/Id';
import { Text, TextOptions } from '../../value-objects/Text/Text';

const messageContentTextOptions: TextOptions = {
  canBeEmpty: false,
  maxLength: 1000,
};

export class Message {
  private constructor(private readonly props: MessageProps) {}

  static create(props: MessageCreateProps): Message {
    const entityProps: MessageProps = {
      id: Id.create(props.id),
      senderId: Id.create(props.senderId),
      conversationId: Id.create(props.conversationId),

      content: Text.create(props.content, messageContentTextOptions),

      sentAt: DomainDate.create(props.sentAt),
    };

    return new Message(entityProps);
  }

  toCreateProps(): MessageCreateProps {
    return {
      id: this.id,
      senderId: this.senderId,
      conversationId: this.conversationId,
      content: this.content,
      sentAt: this.sentAt,
    };
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get senderId() {
    return this.props.senderId.value;
  }

  get conversationId() {
    return this.props.conversationId.value;
  }

  get content() {
    return this.props.content.value;
  }

  get sentAt() {
    return this.props.sentAt.value;
  }
}

export type MessageCreateProps = {
  id: string;
  senderId: string;
  conversationId: string;
  content: string;
  sentAt: Date;
};

export type MessageProps = {
  id: Id;
  senderId: Id;
  conversationId: Id;
  content: Text;
  sentAt: DomainDate;
};
