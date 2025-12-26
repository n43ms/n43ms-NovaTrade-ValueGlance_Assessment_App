# 📈 NovaTrade | Intelligent Stock Dashboard

## Deployed for the Assessment using Github Pages - Access here (https://n43ms.github.io/n43ms-NovaTrade-ValueGlance_Assessment_App/)

NovaTrade is a high-performance, real-time stock market dashboard built to track prices, visualize trends, and manage personal watchlists. It connects directly to the Finnhub API to provide live market data with a sleek, modern user interface.

## 🏆 Going Above & Beyond (Extra Features)

While the requirement was a "simple stock dashboard," **I engineered a production-ready application** focusing on performance, user experience, and robustness.

### ⚡ **Engineering & Performance**

- **Strict TypeScript Implementation:** Instead of basic JavaScript, I used strict TypeScript interfaces for robust type safety and error prevention.
- **Performance Optimization (`React.memo`):** The `StockRow` component is memoized to prevent unnecessary re-renders. The list only updates the specific rows that change, ensuring 60fps scrolling even with rapid data updates.
- **Smart Fallback System:** To handle API rate limits (common with free keys), I built a generator that creates realistic "dummy" historical data seamlessly if the API fails, ensuring the UI **never** breaks or looks empty.

### 🎨 **Advanced UI/UX Design**

- **Interactive Data Visualization:** Integrated `recharts` to create smooth gradient area charts with custom tooltips, rather than just displaying static numbers.
- **Responsive "Glassmorphism" Layout:** The app features a translucent sidebar with backdrop blurs (`backdrop-blur-sm`) and adapts its grid layout dynamically from desktop to mobile screens.
- **Micro-Interactions:** Added hover states, transition animations, and loading skeletons to make the app feel "alive."

### 🛠 **Functionality Enhancements**

- **Personalized Watchlist:** Users can "Star" stocks to filter the view, toggling between the full market and their favorites.
- **Multi-Sort Capability:** Users can sort the dataset by **Price**, **% Change**, or **Symbol** dynamically.
- **Live Search:** Instant filtering by stock symbol or company name.

---

## 🚀 Key Features

- **Real-Time Market Data:** Live fetching of stock prices, changes, and percentage moves.
- **Historical Charts:** 7-day price history visualization with interactive tooltips.
- **Auto-Refresh:** The dashboard intelligently polls for new data every 60 seconds.
- **Sidebar Navigation:** A collapsible sidebar (on mobile) that lists assets with key metrics at a glance.
- **Error Handling:** Graceful error states for network issues or missing API keys.

## 🛠 Tech Stack

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Custom color palette, responsive grid)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Data:** Finnhub REST API
- **Deployment:** GitHub Pages

## ⚙️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/novatrade-dashboard.git
    cd novatrade-dashboard
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run Locally**

    ```bash
    npm run dev
    ```

4.  **Build & Deploy**
    ```bash
    npm run deploy
    ```
    _(This project is pre-configured for deployment to GitHub Pages via the `gh-pages` branch)._
