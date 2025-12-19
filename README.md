# 🎟️ EventHut

EventHut is a modern, full-stack event management web application that allows users to browse events, purchase tickets, and manage their own events seamlessly. The platform focuses on performance, security, and a clean user experience.

---

## 🚀 Features

- 🔍 Browse and explore upcoming events
- 🎫 Purchase event tickets
- ✨ Create, edit, and manage events
- 👤 Dedicated user profile page
  - View purchased tickets
  - View events created by the user
- 🔐 Secure authentication and user management with Clerk
- 📝 Robust form handling with validation
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

### Frontend
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI**
- **React Hook Form**
- **Zod** (schema-based validation)

### Backend
- **MongoDB**
- **Mongoose**
- **Server Actions / API Routes**

### Authentication
- **Clerk**

---

## 📂 Key Pages

- `/` – Browse all events
- `/events/[id]` – Event details & ticket purchase
- `/events/create` – Create a new event
- `/events/[id]/update` – Edit an existing event
- `/profile` – User dashboard (tickets & created events)

