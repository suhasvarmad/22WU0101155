# URL Shortener - Affordmed Assessment Submission

**Submitted by:** Suhas Varma D
**Roll Number:** 22WU0101155

---

## Project Overview

This is a full-stack URL shortener application built as part of the Affordmed technical assessment. It features a backend microservice built with Node.js and Express, and a responsive frontend web application built with React and Material UI.

The application allows users to shorten up to five URLs concurrently, view a list of all URLs created during the current session, and be redirected to the original URL via the generated short link.

## Core Features

### Backend
-   **RESTful API:** A clean API built with Express.js.
-   **URL Shortening:** Accepts a long URL and generates a unique 7-character shortcode.
-   **Custom Shortcodes:** Supports optional user-provided custom shortcodes with collision detection.
-   **Link Expiration:** Links can have an optional validity period, defaulting to 30 minutes.
-   **Redirection:** Handles redirection from the short link to the original long URL.
-   **In-Memory Storage:** Utilizes an in-memory Map for data persistence during a single server session.

### Frontend
-   **Two-Page Application:** A clean interface with a Shortener page and a Statistics page, using React Router for navigation.
-   **Material UI (MUI):** The UI is built exclusively with MUI components for a professional and responsive design.
-   **Concurrent Submissions:** The main page allows users to add and shorten up to 5 URLs at once.
-   **Dynamic Results Display:** Clearly displays the results of the shortening process, mapping each original URL to its new short link.
-   **Session Statistics:** The statistics page fetches and displays all URLs shortened since the server was last started.

## Technologies Used

-   **Backend:** Node.js, Express.js
-   **Frontend:** React, Material UI (MUI), Axios, React Router
-   **Version Control:** Git & GitHub

## How to Run Locally

**Prerequisites:**
-   Node.js (v18 or later)
-   npm

**1. Clone the repository:**
```bash
git clone [https://github.com/suhasvarmad/22WU0101155.git](https://github.com/suhasvarmad/22WU0101155.git)
cd 22WU0101155
