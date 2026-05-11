import { ValidationDomainError } from '../../common/domainErrors';
import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Id } from '../../value-objects/Id/Id';
import { Message } from '../message/Message';

export type ConversationCreateProps = {
  id: string;
  oneParticipantId: string;
  anotherParticipantId: string;

  messages: Message[];

  createdAt: Date;
  updatedAt: Date;
};

export type ConversationProps = {
  id: Id;
  oneParticipantId: Id;
  anotherParticipantId: Id;

  messages: Message[];

  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class Conversation {
  private constructor(private readonly props: ConversationProps) {}

  static create(props: ConversationCreateProps): Conversation {
    const entityProps: ConversationProps = {
      id: Id.create(props.id),
      oneParticipantId: Id.create(props.oneParticipantId),
      anotherParticipantId: Id.create(props.anotherParticipantId),

      messages: props.messages.map((message) => Message.create(message)),

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Conversation(entityProps);
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get participantIds() {
    return [this.props.oneParticipantId.value, this.props.anotherParticipantId.value];
  }

  get messages() {
    return [...this.props.messages];
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
