# Investor Commitments Dashbaord

Application to show investor commitments.

![image](https://github.com/user-attachments/assets/b63a00b0-7934-4cf5-8bef-74baedb07cb0)

## Prerequisites

- Node.js v20.18.3
- Python 3.10+
- Poetry

## Project Structure

### Frontend (React + Vite)

Located in the `frontend` directory.

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# Run tests
npm run test:ui
```

### Backend (FastAPI)

Located in the `backend` directory.

```bash
# Install Poetry dependencies
cd backend
python3 -m poetry install

# Run using Poetry
python3 -m poetry run uvicorn investor_commitments_backend.main:app --reload

# Run tests
python3 -m poetry run pytest
```

The backend uses SQLite for the database, stored at `investor_data.db`.
