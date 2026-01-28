import { useState, useEffect, useCallback } from "react";
import { api } from "./api/client";
import type { components } from "@types-demo/client";

// Type-safe types from the generated client!
type User = components["schemas"]["User"];
type Post = components["schemas"]["Post"];

function App() {
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Message state
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Fetch users - fully typed!
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const { data, error } = await api.GET("/users");
    if (error) {
      showMessage("error", "Failed to fetch users");
    } else if (data) {
      setUsers(data);
      if (data.length > 0 && !selectedUserId) {
        setSelectedUserId(data[0].id);
      }
    }
    setLoadingUsers(false);
  }, [selectedUserId]);

  // Fetch posts - fully typed!
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    const { data, error } = await api.GET("/posts");
    if (error) {
      showMessage("error", "Failed to fetch posts");
    } else if (data) {
      setPosts(data);
    }
    setLoadingPosts(false);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, [fetchUsers, fetchPosts]);

  // Create user - request body is type-checked!
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const { data, error } = await api.POST("/users", {
      body: {
        name: newUserName,
        email: newUserEmail,
      },
    });

    if (error) {
      showMessage("error", "Failed to create user");
    } else if (data) {
      showMessage("success", `Created user: ${data.name}`);
      setNewUserName("");
      setNewUserEmail("");
      fetchUsers();
    }
  };

  // Create post - request body is type-checked!
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent || !selectedUserId) return;

    const { data, error } = await api.POST("/posts", {
      body: {
        title: newPostTitle,
        content: newPostContent,
        authorId: selectedUserId,
        published: true,
      },
    });

    if (error) {
      showMessage("error", "Failed to create post");
    } else if (data) {
      showMessage("success", `Created post: ${data.title}`);
      setNewPostTitle("");
      setNewPostContent("");
      fetchPosts();
    }
  };

  // Delete user - path params are type-checked!
  const handleDeleteUser = async (id: string) => {
    const { error } = await api.DELETE("/users/{id}", {
      params: { path: { id } },
    });

    if (error) {
      showMessage("error", "Failed to delete user");
    } else {
      showMessage("success", "User deleted");
      fetchUsers();
      fetchPosts(); // Refresh posts as they may have been cascade deleted
    }
  };

  // Delete post - path params are type-checked!
  const handleDeletePost = async (id: string) => {
    const { error } = await api.DELETE("/posts/{id}", {
      params: { path: { id } },
    });

    if (error) {
      showMessage("error", "Failed to delete post");
    } else {
      showMessage("success", "Post deleted");
      fetchPosts();
    }
  };

  return (
    <div className="container">
      <h1>Types Demo</h1>
      <p className="subtitle">End-to-End Type Safety from Database to UI</p>

      {/* Type Flow Visualization */}
      <div className="type-flow">
        <h2>Type-Safe Data Flow</h2>
        <div className="type-flow-diagram">
          <span className="type-flow-step">OpenAPI Spec</span>
          <span className="type-flow-arrow">→</span>
          <span className="type-flow-step">Zod Schemas</span>
          <span className="type-flow-arrow">→</span>
          <span className="type-flow-step">Express API</span>
          <span className="type-flow-arrow">→</span>
          <span className="type-flow-step">Generated Client</span>
          <span className="type-flow-arrow">→</span>
          <span className="type-flow-step">React UI</span>
        </div>
      </div>

      {message && (
        <div className={message.type === "error" ? "error" : "success"}>
          {message.text}
        </div>
      )}

      <div className="grid">
        {/* Users Section */}
        <div className="card">
          <div className="card-header">
            <h2>Users</h2>
          </div>

          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label htmlFor="userName">Name</label>
              <input
                id="userName"
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userEmail">Email</label>
              <input
                id="userEmail"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <button type="submit" className="btn-primary">
              Create User
            </button>
          </form>

          <ul className="list" style={{ marginTop: "1rem" }}>
            {loadingUsers ? (
              <div className="loading">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="empty-state">No users yet. Create one above!</div>
            ) : (
              users.map((user) => (
                <li key={user.id} className="list-item">
                  <div className="list-item-content">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Posts Section */}
        <div className="card">
          <div className="card-header">
            <h2>Posts</h2>
          </div>

          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label htmlFor="postAuthor">Author</label>
              <select
                id="postAuthor"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="postTitle">Title</label>
              <input
                id="postTitle"
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="postContent">Content</label>
              <textarea
                id="postContent"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Enter content"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={users.length === 0}
            >
              Create Post
            </button>
          </form>

          <ul className="list" style={{ marginTop: "1rem" }}>
            {loadingPosts ? (
              <div className="loading">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="empty-state">No posts yet. Create one above!</div>
            ) : (
              posts.map((post) => (
                <li key={post.id} className="list-item">
                  <div className="list-item-content">
                    <h3>{post.title}</h3>
                    <p>{post.content.substring(0, 100)}...</p>
                    <span
                      className={`badge ${post.published ? "badge-success" : "badge-warning"}`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Code Example */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <h2>Type-Safe API Calls</h2>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          All API calls are fully typed. TypeScript catches errors at compile
          time!
        </p>
        <pre
          style={{
            background: "#1e1e1e",
            color: "#d4d4d4",
            padding: "1rem",
            borderRadius: "8px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`// Create a user - body is type-checked!
const { data } = await api.POST("/users", {
  body: {
    name: "John Doe",      // ✅ Required
    email: "john@example.com", // ✅ Required, must be email format
    // age: 25,             // ❌ TypeScript error: 'age' not in schema
  },
});

// Response is typed!
console.log(data.id);        // ✅ string (uuid)
console.log(data.createdAt); // ✅ string (datetime)
// console.log(data.foo);    // ❌ TypeScript error: 'foo' doesn't exist`}
        </pre>
      </div>
    </div>
  );
}

export default App;
