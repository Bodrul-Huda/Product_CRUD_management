import React from "react";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 font-sans text-slate-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-2xl font-bold text-transparent">
              E-Commerce Hub
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Product Management Platform
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            Seamless Shopping & Product Management
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Welcome! Explore our collection or log in to manage your inventory,
            update products, and access exclusive feature controls.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              to="/products"
              className="w-full rounded-xl bg-orange-600 px-8 py-3.5 text-center font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
            >
              Browse Catalog
            </Link>
            <Link
              to="/login"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-8 py-3.5 text-center font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white sm:w-auto"
            >
              Log In to Manage
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} E-Commerce Hub. Built with Express,
          MongoDB & React.
        </p>
      </footer>
    </div>
  );
}

export default App;
