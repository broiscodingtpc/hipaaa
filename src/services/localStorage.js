// Mock data for initial setup
const initialData = {
  users: [
    {
      id: '1',
      email: 'admin@example.com',
      password: 'password123', // In a real app, this would be hashed
      name: 'Admin User',
      role: 'admin',
      assignedClients: ['1', '2', '3']
    },
    {
      id: '2',
      email: 'agent@example.com',
      password: 'password123',
      name: 'Call Center Agent',
      role: 'agent',
      assignedClients: ['1', '2']
    },
    {
      id: '3',
      email: 'nurse@example.com',
      password: 'password123',
      name: 'Nurse User',
      role: 'nurse',
      assignedClients: ['1', '2', '3']
    },
    {
      id: '4',
      email: 'client@example.com',
      password: 'password123',
      name: 'Client User',
      role: 'client',
      assignedClients: ['1']
    }
  ],
  clients: [
    {
      id: '1',
      name: 'Hospice Care A',
      timezone: 'America/New_York',
      active: true
    },
    {
      id: '2',
      name: 'Hospice Care B',
      timezone: 'America/Chicago',
      active: true
    },
    {
      id: '3',
      name: 'Hospice Care C',
      timezone: 'America/Los_Angeles',
      active: true
    }
  ],
  calls: [
    {
      id: '1',
      clientId: '1',
      userId: '2',
      patientId: 'PT001',
      callType: 'inbound',
      summary: 'Patient reported severe pain',
      categories: ['Pain'],
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      clientId: '2',
      userId: '2',
      patientId: 'PT002',
      callType: 'outbound',
      summary: 'Follow-up on medication refill',
      categories: ['Refill'],
      timestamp: new Date().toISOString()
    }
  ],
  categories: [
    { id: '1', label: 'Pain' },
    { id: '2', label: 'Refill' },
    { id: '3', label: 'Constipation' },
    { id: '4', label: 'Anxiety' }
  ]
};

// Initialize localStorage with empty arrays if not exists
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('clients')) {
  localStorage.setItem('clients', JSON.stringify([]));
}
if (!localStorage.getItem('calls')) {
  localStorage.setItem('calls', JSON.stringify([]));
}
if (!localStorage.getItem('categories')) {
  localStorage.setItem('categories', JSON.stringify([]));
}

// Initialize localStorage with default data if empty
const initializeDefaultUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'test123',
        role: 'admin',
        assignedClients: []
      },
      {
        id: '2',
        name: 'Nurse User',
        email: 'nurse@example.com',
        password: 'test123',
        role: 'nurse',
        assignedClients: ['1', '2']
      },
      {
        id: '3',
        name: 'Client User',
        email: 'client@example.com',
        password: 'test123',
        role: 'client',
        assignedClients: ['1']
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
};

// Initialize default clients if empty
const initializeDefaultClients = () => {
  const clients = JSON.parse(localStorage.getItem('clients') || '[]');
  if (clients.length === 0) {
    const defaultClients = [
      {
        id: '1',
        name: 'Hospice Care A',
        timezone: 'America/New_York',
        active: true
      },
      {
        id: '2',
        name: 'Hospice Care B',
        timezone: 'America/Chicago',
        active: true
      }
    ];
    localStorage.setItem('clients', JSON.stringify(defaultClients));
  }
};

// Initialize default categories if empty
const initializeDefaultCategories = () => {
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  if (categories.length === 0) {
    const defaultCategories = [
      { id: '1', label: 'Pain Management' },
      { id: '2', label: 'Medication Refill' },
      { id: '3', label: 'Constipation' },
      { id: '4', label: 'Nausea' },
      { id: '5', label: 'Anxiety' },
      { id: '6', label: 'Other' }
    ];
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }
};

// Initialize all default data
const initializeDefaultData = () => {
  initializeDefaultUsers();
  initializeDefaultClients();
  initializeDefaultCategories();
};

// Call initialization
initializeDefaultData();

// Auth service
export const authService = {
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  logout: () => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser'));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('currentUser');
  }
};

// User service
export const userService = {
  getUsers: () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users;
  },
  getUser: (id) => {
    const users = userService.getUsers();
    return users.find(user => user.id === id);
  },
  addUser: (userData) => {
    const users = userService.getUsers();
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },
  updateUser: (id, updatedData) => {
    const users = userService.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem('users', JSON.stringify(users));
    return users[index];
  },
  deleteUser: (id) => {
    const users = userService.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
  }
};

// Client service
export const clientService = {
  getClients: () => {
    return JSON.parse(localStorage.getItem('clients') || '[]');
  },
  addClient: (clientData) => {
    const clients = clientService.getClients();
    const newClient = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(clients));
    return newClient;
  },
  updateClient: (id, updatedData) => {
    const clients = clientService.getClients();
    const index = clients.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    clients[index] = { ...clients[index], ...updatedData };
    localStorage.setItem('clients', JSON.stringify(clients));
    return clients[index];
  },
  deleteClient: (id) => {
    const clients = clientService.getClients();
    const filteredClients = clients.filter(client => client.id !== id);
    localStorage.setItem('clients', JSON.stringify(filteredClients));
  }
};

// Call service
export const callService = {
  getCalls: () => {
    return JSON.parse(localStorage.getItem('calls') || '[]');
  },
  addCall: (callData) => {
    const calls = callService.getCalls();
    const newCall = {
      ...callData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    calls.push(newCall);
    localStorage.setItem('calls', JSON.stringify(calls));
    return newCall;
  },
  updateCall: (id, updatedData) => {
    const calls = callService.getCalls();
    const index = calls.findIndex(call => call.id === id);
    if (index === -1) {
      throw new Error('Call not found');
    }
    calls[index] = { ...calls[index], ...updatedData };
    localStorage.setItem('calls', JSON.stringify(calls));
    return calls[index];
  },
  deleteCall: (id) => {
    const calls = callService.getCalls();
    const filteredCalls = calls.filter(call => call.id !== id);
    localStorage.setItem('calls', JSON.stringify(filteredCalls));
  }
};

// Category service
export const categoryService = {
  getCategories: () => {
    return JSON.parse(localStorage.getItem('categories') || '[]');
  },
  addCategory: (categoryData) => {
    const categories = categoryService.getCategories();
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    return newCategory;
  },
  updateCategory: (id, updatedData) => {
    const categories = categoryService.getCategories();
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    categories[index] = { ...categories[index], ...updatedData };
    localStorage.setItem('categories', JSON.stringify(categories));
    return categories[index];
  },
  deleteCategory: (id) => {
    const categories = categoryService.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    localStorage.setItem('categories', JSON.stringify(filteredCategories));
  }
}; 