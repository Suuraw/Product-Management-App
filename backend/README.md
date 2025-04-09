
# Product Management Web App - Backend
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Project setup

```bash
$ cd backend
$ npm install
```

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Configure Environment Variables

##### Create a .env file in the root directory.
```ts
DATABASE_URL=""
JWT_SECRET=""
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Start the Server
```bash
npm run start:dev
```

---

## Testing Routes with Postman
```bash
[
  {
    "route": "Signup (Create a User)",
    "endpoint": "POST http://localhost:3000/auth/signup",
    "method": "POST",
    "body": {
      "email": "testuser@example.com",
      "password": "test123",
      "role": "USER"
    },
    "response": {
      "message": "User created",
      "userId": "<some-id>"
    },
    "notes": "Use 'role: \"ADMIN\"' for admin access."
  },
  {
    "route": "Login (Get Token)",
    "endpoint": "POST http://localhost:3000/auth/login",
    "method": "POST",
    "body": {
      "email": "admin@example.com",
      "password": "admin123"
    },
    "response": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  {
    "route": "Create Product (Admin Only)",
    "endpoint": "POST http://localhost:3000/products",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer <token>"
    },
    "body": {
      "name": "Laptop",
      "description": "High-performance laptop",
      "category": "Electronics",
      "price": "999.99",
      "rating": "4.5",
      "userId": "<user-id-from-signup>",
      "image": "<upload sample.jpg>"
    },
    "response": {
      "id": "<some-id>",
      "name": "Laptop",
      "description": "High-performance laptop",
      "category": "Electronics",
      "price": 999.99,
      "rating": 4.5,
      "image": "<timestamp>-sample.jpg",
      "userId": "<user-id>",
      "createdAt": "2025-04-08T10:00:00Z",
      "updatedAt": "2025-04-08T10:00:00Z"
    },
    "notes": "Returns 403 if not an admin. Use form-data for body."
  },
  {
    "route": "Get All Products (with Pagination and Sorting)",
    "endpoint": "GET http://localhost:3000/products",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer <token>"
    },
    "queryParams": "?page=1&limit=5&sortBy=price&sortOrder=desc",
    "response": [
      {
        "id": "<some-id>",
        "name": "Laptop",
        "description": "High-performance laptop",
        "category": "Electronics",
        "price": 999.99,
        "rating": 4.5,
        "image": "<timestamp>-sample.jpg",
        "userId": "<user-id>",
        "createdAt": "2025-04-08T10:00:00Z",
        "updatedAt": "2025-04-08T10:00:00Z"
      }
    ]
  },
  {
    "route": "Update Product (Admin Only)",
    "endpoint": "PUT http://localhost:3000/products/<product-id>",
    "method": "PUT",
    "headers": {
      "Authorization": "Bearer <token>"
    },
    "body": {
      "name": "Updated Laptop",
      "price": "1099.99",
      "image": "<upload new-sample.jpg>"
    },
    "response": {
      "id": "<product-id>",
      "name": "Updated Laptop",
      "description": "High-performance laptop",
      "category": "Electronics",
      "price": 1099.99,
      "rating": 4.5,
      "image": "<new-timestamp>-new-sample.jpg",
      "userId": "<user-id>",
      "createdAt": "2025-04-08T10:00:00Z",
      "updatedAt": "2025-04-08T10:00:00Z"
    },
    "notes": "Use form-data for body."
  },
  {
    "route": "Delete Product (Admin Only)",
    "endpoint": "DELETE http://localhost:3000/products/<product-id>",
    "method": "DELETE",
    "headers": {
      "Authorization": "Bearer <token>"
    },
    "response": {
      "id": "<product-id>",
      "name": "Updated Laptop",
      "description": "High-performance laptop",
      "category": "Electronics",
      "price": 1099.99,
      "rating": 4.5,
      "image": "<timestamp>-new-sample.jpg",
      "userId": "<user-id>",
      "createdAt": "2025-04-08T10:00:00Z",
      "updatedAt": "2025-04-08T10:00:00Z"
    }
  },
  {
    "route": "Filter Products",
    "endpoint": "GET http://localhost:3000/products",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer <token>"
    },
    "queryParams": "?category=Electronics&priceMin=500&priceMax=1500&rating=4",
    "response": [
      {
        "id": "<some-id>",
        "name": "Laptop",
        "description": "High-performance laptop",
        "category": "Electronics",
        "price": 999.99,
        "rating": 4.5,
        "image": "<timestamp>-sample.jpg",
        "userId": "<user-id>",
        "createdAt": "2025-04-08T10:00:00Z",
        "updatedAt": "2025-04-08T10:00:00Z"
      }
    ]
  },
  {
    "route": "Search Products",
    "endpoint": "GET http://localhost:3000/products",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer <token>"
    },
    "queryParams": "?search=laptop",
    "response": [
      {
        "id": "<some-id>",
        "name": "Laptop",
        "description": "High-performance laptop",
        "category": "Electronics",
        "price": 999.99,
        "rating": 4.5,
        "image": "<timestamp>-sample.jpg",
        "userId": "<user-id>",
        "createdAt": "2025-04-08T10:00:00Z",
        "updatedAt": "2025-04-08T10:00:00Z"
      }
    ]
  }
]

---

### Step 3: Troubleshooting
- **401 Unauthorized**: Check if the token is valid or expired.
- **403 Forbidden**: Ensure you’re using an admin token for CRUD operations.
- **404 Not Found**: Verify the product ID.
- **500 Server Error**: Check MongoDB connection or console logs.

---
