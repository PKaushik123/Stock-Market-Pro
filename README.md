# StockMarket Pro

A full-stack paper trading application built with React, Vite, Node.js, Express, MongoDB and Tailwind CSS.

## Overview

This project is a simulated stock trading dashboard for users to browse markets, create watchlists, track portfolio performance, and execute virtual buy/sell trades using mock market data.

## Architecture

- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Express + MongoDB + JWT auth
- Data layer: Mongoose models with a mock fallback for local development
- Market data: provider abstraction; default mode is mock data labeled clearly as simulated

## Features

- Secure signup/login with hashed passwords
- Dashboard with summary cards and market overview
- Search and filter stocks
- Watchlist persistence for authenticated users
- Portfolio tracking with simulated cash balances
- Paper trading buy/sell flows
- Orders history page
- News overview and stock detail screen
- Dark mode aware financial dashboard styling

## Local setup

1. Copy the environment examples:
   - frontend/.env.example -> frontend/.env
   - backend/.env.example -> backend/.env
2. Install dependencies:
   - cd frontend && npm install
   - cd backend && npm install
3. Start MongoDB locally or use a remote connection in the backend .env file.
4. Run the app:
   - npm run frontend
   - npm run backend

## Notes

This project is intentionally paper trading only and does not involve real brokerage or real money movement.
