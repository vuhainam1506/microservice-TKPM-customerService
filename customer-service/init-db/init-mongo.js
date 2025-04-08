print('Starting database initialization...');

db = db.getSiblingDB('customer_db');

print('Connected to customer_db database');

db.customers.drop();

const customers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "123-456-7890",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    gender: "male",
    dateOfBirth: new Date("1990-01-15")
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    phone: "098-765-4321",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001"
    },
    gender: "female",
    dateOfBirth: new Date("1992-05-20")
  }
];

const result = db.customers.insertMany(customers);

print('Sample customers inserted successfully!');
print('Insertion result:', JSON.stringify(result));