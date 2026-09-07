function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/login" element={<h1>Login Page</h1>} />
      <Route path="/signup" element={<h1>Signup Page</h1>} />
      <Route path="/dashboard" element={<h1>Dashboard Page</h1>} />
      <Route path="/projects" element={<h1>Projects Page</h1>} />
      <Route path="/profile" element={<h1>Profile Page</h1>} />
    </Routes>
  );
}

export default App;
