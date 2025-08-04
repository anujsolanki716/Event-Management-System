export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  token?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  creator: {
    _id: string;
    name: string;
  };
  attendees: User[];
  comments: Comment[];
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  text: string;
  timestamp: string;
}

export interface Ticket {
  type: 'General' | 'VIP';
  price: number;
}
