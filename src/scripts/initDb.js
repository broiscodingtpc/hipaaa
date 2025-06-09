import { 
  collection, 
  addDoc, 
  getDocs,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTIONS = {
  CALLS: 'calls',
  USERS: 'users',
  CLIENTS: 'clients',
  CATEGORIES: 'categories'
};

// Date de test pentru MVP
const testData = {
  clients: [
    { name: 'Hospice Care A', timezone: 'America/New_York', active: true },
    { name: 'Hospice Care B', timezone: 'America/Chicago', active: true },
    { name: 'Hospice Care C', timezone: 'America/Los_Angeles', active: true }
  ],
  categories: [
    { label: 'Pain', description: 'Pain management related calls' },
    { label: 'Refill', description: 'Medication refill requests' },
    { label: 'Constipation', description: 'Constipation related issues' },
    { label: 'Anxiety', description: 'Anxiety and emotional support' },
    { label: 'Other', description: 'Other concerns' }
  ],
  users: [
    {
      email: 'admin@example.com',
      role: 'admin',
      assignedClients: ['1', '2', '3']
    },
    {
      email: 'agent@example.com',
      role: 'agent',
      assignedClients: ['1']
    },
    {
      email: 'nurse@example.com',
      role: 'nurse',
      assignedClients: ['1', '2']
    }
  ],
  calls: [
    {
      clientId: '1',
      callType: 'inbound',
      patientId: 'PT001',
      summary: 'Patient reported severe pain in lower back',
      categories: ['Pain'],
      timestamp: new Date('2024-03-15T10:30:00').toISOString(),
      userId: '1'
    },
    {
      clientId: '2',
      callType: 'outbound',
      patientId: 'PT002',
      summary: 'Follow-up on medication refill request',
      categories: ['Refill'],
      timestamp: new Date('2024-03-15T11:45:00').toISOString(),
      userId: '2'
    }
  ]
};

// Funcție pentru ștergerea tuturor documentelor dintr-o colecție
async function clearCollection(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const deletePromises = querySnapshot.docs.map(doc => 
    deleteDoc(doc.ref)
  );
  await Promise.all(deletePromises);
}

// Funcție pentru inițializarea bazei de date
export async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    // Șterge datele existente
    console.log('Clearing existing data...');
    await Promise.all([
      clearCollection(COLLECTIONS.CLIENTS),
      clearCollection(COLLECTIONS.CATEGORIES),
      clearCollection(COLLECTIONS.USERS),
      clearCollection(COLLECTIONS.CALLS)
    ]);

    // Adaugă clienții
    console.log('Adding clients...');
    const clientDocs = await Promise.all(
      testData.clients.map(client => 
        addDoc(collection(db, COLLECTIONS.CLIENTS), client)
      )
    );
    const clientIds = clientDocs.map(doc => doc.id);

    // Adaugă categoriile
    console.log('Adding categories...');
    const categoryDocs = await Promise.all(
      testData.categories.map(category => 
        addDoc(collection(db, COLLECTIONS.CATEGORIES), category)
      )
    );
    const categoryIds = categoryDocs.map(doc => doc.id);

    // Adaugă utilizatorii
    console.log('Adding users...');
    const userDocs = await Promise.all(
      testData.users.map(user => 
        addDoc(collection(db, COLLECTIONS.USERS), user)
      )
    );
    const userIds = userDocs.map(doc => doc.id);

    // Adaugă apelurile
    console.log('Adding calls...');
    await Promise.all(
      testData.calls.map(call => 
        addDoc(collection(db, COLLECTIONS.CALLS), call)
      )
    );

    console.log('Database initialization completed successfully!');
    return {
      clientIds,
      categoryIds,
      userIds
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Rulare script
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
} 