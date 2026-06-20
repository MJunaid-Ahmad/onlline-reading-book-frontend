import { useState } from "react";
import { Profile } from "./components/User";
import Login from "./components/Login";
import { Route, Routes } from "react-router";
import Dashboard from "./components/Dashboard";
import Books from "./components/Books";
import Authors from "./components/Authors";
import Categories from "./components/Categories";
import AddBook from "./components/AddBook";
import AddAuthor from "./components/AddAuthor";
import AddCategory from "./components/AddCategory";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/add-author" element={<AddAuthor />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/add-category" element={<AddCategory />} />
      </Routes>
    </div>
  );
}

export default App;
