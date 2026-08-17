# Real-Time Synthetic Option Pricing Grid

A real-time synthetic options pricing application built with Python/FastAPI and React/TypeScript.

The application simulates an underlying instrument, calculates synthetic European option prices using the Black-Scholes model, and publishes pricing updates through a WebSocket connection to a React frontend.

## Architecture

```text
┌──────────────────────────┐
│ Python Synthetic         │
│ Pricing Service          │
│                          │
│ • Random walk simulator  │
│ • Black-Scholes pricing  │
│ • Option Greeks          │
└────────────┬─────────────┘
             │
             │ WebSocket
             ▼
┌──────────────────────────┐
│ React / TypeScript       │
│ Frontend                 │
│                          │
│ • Real-time pricing grid │
│ • Strike filtering       │
│ • Simulator controls     │
│ • Price change feedback  │
└──────────────────────────┘
The Python service handles simulation and pricing calculations, while the React frontend handles presentation and user interaction.

## WebSocket Communication

The React frontend establishes a WebSocket connection to the Python/FastAPI pricing service.

The Python service continuously sends updated spot prices, timestamps, option prices and Greeks to the frontend while the simulator is running.

The frontend also sends control messages back through the same WebSocket for Start, Stop, Reset, update frequency, starting price and volatility changes.

This provides real-time, two-way communication without repeatedly polling the backend.

Features
Core Features
Synthetic underlying price generation
Black-Scholes call and put pricing
Real-time WebSocket communication
Live underlying spot price
Last update timestamp
Real-time option pricing grid
Strike range filtering
Start / Stop / Reset controls
Configurable update frequency
Configurable starting price

Optional Enhancements
Delta
Gamma
Theta
Vega
Configurable volatility
Temporary price increase/decrease highlighting

Project Structure

synthetic_option_pricing/
│
├── pricing_service/
│   ├── main.py
│   ├── models.py
│   ├── pricing.py
│   ├── simulator.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PricingTable.tsx
│   │   │   ├── SimulatorControls.tsx
│   │   │   └── StrikeFilter.tsx
│   │   ├── types/
│   │   │   └── pricing.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
└── README.md

Backend

The backend is implemented using Python and FastAPI.

Responsibilities

simulator.py

Simulates the underlying price using a simple random walk
Generates option strikes
Handles starting price and volatility
Generates pricing data
Resets the simulator

pricing.py

Implements Black-Scholes option pricing
Calculates call and put prices
Calculates Delta, Gamma, Theta and Vega

main.py

Creates the FastAPI application
Provides the WebSocket endpoint
Receives simulator commands from the frontend
Publishes real-time pricing updates

models.py

Defines structured pricing data using Pydantic models
Pricing Assumptions
Initial underlying price: 20,000
Strike spacing: 100
Five strikes are generated around the starting price
Initial volatility: 20%
Risk-free interest rate: 5%
Time to expiry: 30 days
The underlying follows a simple random walk with movements between -5 and +5 per update
Black-Scholes is used for European call and put pricing

The simulator is intended as a synthetic pricing demonstration rather than a production trading system.

WebSocket Communication

The frontend connects to:

ws://localhost:8000/ws

The Python service sends pricing updates containing:

Current spot price
Timestamp
Strike prices
Call prices
Put prices
Option Greeks

The React application also sends simulator control commands through the WebSocket, including:

Start
Stop
Reset
Update frequency
Starting price
Volatility

This provides two-way real-time communication between the frontend and Python pricing service.


Libraries

Backend
Python
FastAPI
Uvicorn
SciPy
Pydantic
Frontend
React
TypeScript
Vite
Deployment
Docker
Docker Compose
Nginx


Running Locally:

Backend

From the project root:

cd pricing_service
pip install -r requirements.txt
uvicorn main:app --reload

The backend will run on:

http://127.0.0.1:8000

The WebSocket endpoint is:

ws://127.0.0.1:8000/ws

Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Then open the URL provided by Vite, normally:

http://localhost:5173

Running with Docker

From the project root:

docker compose build
docker compose up

Then open:

http://localhost:5173

The backend is exposed on:

http://localhost:8000

To stop the containers:

docker compose down

Design Approach:

The backend separates the simulator, pricing calculations, data models and WebSocket communication into separate modules.

The React application separates the simulator controls, strike filtering and pricing table into individual components while keeping application state and WebSocket communication in the main application component.

This separation keeps the pricing logic independent from the frontend presentation layer and makes the application easier to extend.

Optional Enhancements Implemented:

The optional enhancements from the assessment that were implemented are:

Option Greeks: Delta, Gamma, Theta and Vega
Volatility control
Temporary price-change highlighting