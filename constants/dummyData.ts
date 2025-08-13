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
  {
    id: '2',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    lastMessage: {
      text: 'Meeting at 3pm tomorrow',
      time: '9:15 AM',
    },
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'About the project deadline',
        time: '9:00 AM',
        sender: 'them',
      },
      {
        id: '2',
        text: 'Meeting at 3pm tomorrow',
        time: '9:15 AM',
        sender: 'me',
      },
    ],
  },
  {
    id: '3',
    user: {
      name: 'Mike Chen',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    lastMessage: {
      text: 'The documents are ready',
      time: 'Yesterday',
    },
    unreadCount: 1,
    messages: [
      {
        id: '1',
        text: 'Working on those files',
        time: 'Yesterday, 4:30 PM',
        sender: 'them',
      },
      {
        id: '2',
        text: 'The documents are ready',
        time: 'Yesterday, 5:45 PM',
        sender: 'them',
      },
    ],
  },
  {
    id: '4',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    lastMessage: {
      text: 'Thanks for your help!',
      time: 'Tuesday',
    },
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'I need some assistance',
        time: 'Tuesday, 11:20 AM',
        sender: 'them',
      },
      {
        id: '2',
        text: 'Thanks for your help!',
        time: 'Tuesday, 12:45 PM',
        sender: 'them',
      },
    ],
  },
  {
    id: '5',
    user: {
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    lastMessage: {
      text: 'Let me check and get back to you',
      time: 'Monday',
    },
    unreadCount: 3,
    messages: [
      {
        id: '1',
        text: 'Have you reviewed the proposal?',
        time: 'Monday, 2:15 PM',
        sender: 'me',
      },
      {
        id: '2',
        text: 'Let me check and get back to you',
        time: 'Monday, 2:30 PM',
        sender: 'them',
      },
    ],
  },
  {
    id: '6',
    user: {
      name: 'Lisa Wong',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    lastMessage: {
      text: 'The package has been delivered',
      time: 'Sunday',
    },
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'Tracking says out for delivery',
        time: 'Sunday, 10:00 AM',
        sender: 'them',
      },
      {
        id: '2',
        text: 'The package has been delivered',
        time: 'Sunday, 1:20 PM',
        sender: 'them',
      },
    ],
  },
  {
    id: '7',
    user: {
      name: 'Robert Garcia',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    lastMessage: {
      text: 'See you at the conference!',
      time: 'Saturday',
    },
    unreadCount: 0,
    messages: [
      {
        id: '1',
        text: 'Are you attending TechConf?',
        time: 'Saturday, 9:00 AM',
        sender: 'me',
      },
      {
        id: '2',
        text: 'See you at the conference!',
        time: 'Saturday, 9:30 AM',
        sender: 'them',
      },
    ],
  },
  {
    id: '8',
    user: {
      name: 'Olivia Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    },
    lastMessage: {
      text: 'The budget was approved',
      time: 'Friday',
    },
    unreadCount: 2,
    messages: [
      {
        id: '1',
        text: 'Waiting for finance approval',
        time: 'Friday, 3:00 PM',
        sender: 'them',
      },
      {
        id: '2',
        text: 'The budget was approved',
        time: 'Friday, 4:45 PM',
        sender: 'them',
      },
    ],
  },
];

export const calls = [
  {
    id: '1',
    user: {
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    type: 'video',
    direction: 'Outgoing',
    time: 'Yesterday, 2:45 PM',
    missed: false,
  },
  {
    id: '2',
    user: {
      name: 'Alex Turner',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    type: 'voice',
    direction: 'Incoming',
    time: 'Today, 9:30 AM',
    missed: true,
  },
  {
    id: '3',
    user: {
      name: 'Sophia Williams',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    type: 'video',
    direction: 'Incoming',
    time: 'Today, 11:15 AM',
    missed: false,
  },
  {
    id: '4',
    user: {
      name: 'Daniel Lee',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    type: 'voice',
    direction: 'Outgoing',
    time: 'Yesterday, 5:20 PM',
    missed: false,
  },
  {
    id: '5',
    user: {
      name: 'Megan Brown',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    type: 'video',
    direction: 'Incoming',
    time: 'Monday, 3:10 PM',
    missed: true,
  },
  {
    id: '6',
    user: {
      name: 'Kevin Adams',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    type: 'voice',
    direction: 'Outgoing',
    time: 'Sunday, 7:45 PM',
    missed: false,
  },
  {
    id: '7',
    user: {
      name: 'Natalie Clark',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    },
    type: 'video',
    direction: 'Incoming',
    time: 'Saturday, 12:30 PM',
    missed: false,
  },
  {
    id: '8',
    user: {
      name: 'Thomas Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    },
    type: 'voice',
    direction: 'Outgoing',
    time: 'Friday, 4:55 PM',
    missed: false,
  },
];