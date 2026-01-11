# Logistics Form migration

**Logistics Form migration** is an Angular playground project focused on experimenting with **Angular 21 Signal Forms** by migrating a form from **Reactive Forms** to the new signal-based API.

The goal of this project is to explore how Signal Forms handle:

* Nested objects
* Dynamic arrays
* Async validators
* Conditional fields
* Conditional validation requirements

It serves as a practical comparison between legacy Reactive Forms and modern Signal Forms, highlighting differences in state management, validation, and custom controls.

---

## Project Purpose

This project hands-on experiment designed to understand how Signal Forms behave when dealing with non-trivial form scenarios commonly found in enterprise applications.

---

## Key Features

### 1. Form Logic

* **Deep Nesting**
  Manages nested data structures such as:

  ```
  Transport → Customs → Clearance Code
  ```

  using strictly typed form models.

* **Dynamic Arrays**
  A Cargo Inventory section where items can be added or removed dynamically.

* **Conditional Validation**

  * **Runtime Swapping**:
    Changing the Transport Mode (Air / Sea) dynamically updates the maximum weight validator for all cargo items.
  * **Cross-Field Dependency**:
    The *Hazard Class* field becomes required only when *Is Hazardous* is checked.

---

### 2. Architecture Comparison

| Feature          | Reactive Forms                               | Signal Forms                                                  |
| ---------------- | -------------------------------------------- |---------------------------------------------------------------|
| State Management | `FormGroup`, `FormControl`, `FormArray`      | `form()`, `model()`, `signal()` `linkedSignal()`              |
| Data Flow        | RxJS (`valueChanges`)                        | Native Signals (`computed`, `effect`) and `schema` definition |
| Custom Controls  | `ControlValueAccessor`                       | `FormValueControl`                                            |
| Boilerplate      | High (providers, `forwardRef`, `writeValue`) | Minimal (direct model binding)                                |

---

### 3. Custom Controls

* **Reactive Weight Input**

  * Implements `ControlValueAccessor`
  * Handles internal unit conversion (kg / lbs)
  * Exposes a normalized value to the parent form

* **Signal Weight Input**

  * Uses the `FormValueControl` interface
  * Relies on `model()` for two-way binding
  * No CVA providers or manual syncing required

---

### 4. UI / UX

* **Wizard Pattern**
  Multi-step flow separating Transport details and Cargo inventory

* **Async Validation**
  Simulates API latency for validating Customs Clearance codes, including:

  * Pending state handling
  * Error feedback

* **Interactive Feedback**

  * Toast notifications
  * Read-only confirmation modal for final review

* **Styling**

  * Tailwind CSS

---

## Tech Stack

* **Framework:** Angular 21 (Experimental Signal Forms)
* **Language:** TypeScript 5.x
* **Styling:** Tailwind CSS
* **State Management:** Angular Signals

---

## Project Structure

The project is intentionally split to show **before** and **after** implementations.

```
src/app/
├── reactive/
│   ├── views/
│   │   ├── manifest.ts
│   │   └── weight-input.ts
│   ├── models/
│   │   └── form and domain interfaces
│   └── services/
│       └── mock async validation services
│
└── signal/
    └── implementation using Signal Forms API
```

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

### View the Application

Open your browser and navigate to:

```
http://localhost:4200
```

---


## Notes

This repository is meant for experimentation, learning, and discussion around Signal Forms.
Expect iteration, refactoring, and exploration rather than polished abstractions.
