# Meal Planning App (Microservices Simulation)

A frontend-focused meal planning application built with Node.js that simulates multiple microservices. The app demonstrates modular architecture and dynamic data handling using dummy data, including meal suggestions, user preferences, favorites management, and a motivational quote generator.

## Overview

This project showcases a microservice-inspired architecture entirely on the frontend. Each “service” is implemented as a separate Node.js module that provides simulated functionality. Users can interact with a full-featured meal planning experience without a real backend or database.

## Simulated Microservices

- **Suggestions Service**  
  Generates meal recommendations based on simulated user preferences.

- **Preferences Service**  
  Stores and retrieves mock user dietary preferences.

- **Favorites Service**  
  Tracks and manages a user’s favorite meals using in-memory dummy data.

- **Quote Generator Service**  
  Provides motivational or informational quotes to enhance the experience.

## Features

- Modular Node.js services simulating real backend functionality  
- Dynamic, interactive meal suggestions based on dummy data  
- User preferences management  
- Favorites management  
- Motivational quote generator  
- Fully frontend-driven with no real database or backend required  

## Tech Stack

- Node.js  
- JavaScript  
- HTML/CSS (if applicable for UI)  
- Dummy data for service simulation  

## How to Run

### Requirements
- Node.js (v18+ recommended)  
- npm  
- Terminal or command prompt

### Start Each Microservice

Each service runs independently. Open a separate terminal for each microservice:

```bash
# Clone the repository
git clone https://github.com/chsee1/CS361Proj
cd mealplanner

# Install dependencies
npm install

# Start services individually in separate terminals
CD into each microservice, and node either index.js or server.js
