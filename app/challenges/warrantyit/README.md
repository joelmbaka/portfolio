# WarrantyIT - Product Warranty Manager

A web application for managing product warranty details with multi-user support.

## Challenge Requirements Met

✅ Single landing page to input product details  
✅ Confirm button to save the details  
✅ Backend to handle data storage and retrieval  
✅ Database schema supporting multiple users and products  
✅ Production-level code quality  

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS  
**Backend:** FastAPI, Python  
**Database:** PostgreSQL (Supabase)  
**Auth:** Supabase Auth with JWT  

## Features

- User authentication (sign in/up)
- Add products with warranty details
- View personal product list
- Form validation
- Responsive design
- Row-level security (RLS)

## Form Fields

- Product Name (required)
- Brand (required) 
- Type (required)
- Warranty Period in months (required, ≥0)
- Start Date (required)

## API Endpoints

- `GET /products` - List user's products
- `POST /products` - Create new product
- `GET /health` - Health check

## Database Schema

```sql
products (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  brand text NOT NULL,
  type text NOT NULL,
  warranty_months integer NOT NULL CHECK (warranty_months >= 0),
  start_date date NOT NULL,
  created_at timestamptz DEFAULT now()
)
```

## Setup

1. Install dependencies: `npm install`
2. Configure Supabase environment variables
3. Run database migrations
4. Start backend: `python backend/main.py`
5. Start frontend: `npm run dev`
6. Visit `/challenges/warrantyit`

## Live Demo

Route: `/challenges/warrantyit`

Sign in to add and manage your product warranties.
