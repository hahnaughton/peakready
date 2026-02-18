# PeakReady

PeakReady is a mobile app built with React Native and Expo that allows athletes to log daily recovery metrics and calculate a readiness score from 0–100.

The goal of the project was to demonstrate clean architecture, separation of concerns, persistence, and testable business logic in a simple mobile app.

---

## 🚀 Features

- Log daily recovery metrics:
  - Sleep (hours)
  - Workout intensity (1–10)
  - Muscle soreness (1–10)
- Automatic readiness score calculation
- Dynamic UI states (color zones + emoji indicators)
- Local persistence using AsyncStorage
- History screen with delete functionality (basic CRUD)
- Unit tests for scoring logic using Jest

---

## 🧠 Readiness Logic

The readiness score is calculated in a pure TypeScript function located in `utils/readiness.ts`.

Calculation model:
- Sleep increases readiness
- Intensity applies a penalty
- Soreness applies a penalty
- Final score is clamped between 0–100

The scoring logic is isolated from UI and storage, making it:
- Deterministic
- Easily testable
- Reusable
- Safe to refactor independently

Unit tests validate:
- Strong recovery cases
- Overtraining scenarios
- Boundary constraints (never < 0, never > 100)

---

## 🏗 Architecture

app/
index.tsx → Home dashboard (loads today’s log and displays readiness)
log.tsx → Input form for daily metrics
history.tsx → List + delete previous logs

utils/
readiness.ts → Pure scoring logic
storage.ts → AsyncStorage abstraction layer

tests/
readiness.test.ts


### Architectural Principles Used

**Separation of Concerns**
- UI components render state only.
- Business logic lives in pure utility functions.
- Storage access is abstracted behind helper functions.

**File-Based Routing**
- Implemented using Expo Router.
- Each file inside `app/` automatically becomes a route.

**Persistence Abstraction**
- Screens do not directly interact with AsyncStorage.
- All persistence logic lives inside `utils/storage.ts`.
- This allows easy future migration to a backend API.

**Testability**
- Core readiness logic is isolated and covered by Jest tests.
- No UI dependencies in business logic.

---

## 📦 Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage
- Jest + ts-jest

---

## 🔄 Data Flow

1. User logs metrics in `log.tsx`
2. Metrics are validated and saved via `saveLog()` (storage abstraction)
3. Home screen uses `useFocusEffect` to reload today's log
4. `calculateReadiness()` computes the score
5. UI updates dynamically based on readiness zone
6. History screen reads all logs and recalculates scores
7. Logs can be deleted via `deleteLog()` (CRUD support)

---

## 🛠 Running Locally

Install dependencies:

```bash
npm install
Start the development server:

npx expo start
Open in:

iOS Simulator

Android Emulator

Expo Go app

🧪 Run Tests
npm test
All readiness scoring logic is covered by unit tests.

🔮 Future Improvements
Multiple logs per day (timestamp-based entries)

Readiness trend visualization (charts)

Backend sync for multi-device support

Authentication layer

Performance analytics

Export/share functionality

📌 Why This Project
This project was built to demonstrate:

Structured mobile application architecture

Clean separation between UI, logic, and storage

Type-safe development with TypeScript

Test-driven thinking around business rules

Basic CRUD implementation

Scalable design for future backend integration
