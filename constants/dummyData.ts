export const chats = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    lastMessage: {
      text: 'Hey, how are you doing?',
      time: '10:30 AM',
    },
    unreadCount: 2,
    messages: [
      {
        id: '1',
        text: 'Hey there!',
        time: '10:20 AM',
        sender: 'them',
      },
      {
        id: '2',
        text: 'How are you doing?',
        time: '10:30 AM',
        sender: 'them',
      },
    ],
  },
  // Add more chats...
];

export const calls = [
  {
    id: '1',
    user: {
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    type: 'video', // or 'voice'
    direction: 'Outgoing', // or 'Incoming'
    time: 'Yesterday, 2:45 PM',
    missed: false,
  },
  // Add more calls...
];