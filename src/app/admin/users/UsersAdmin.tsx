"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

interface Props {
  users: User[];
  currentUserId: string;
}

export default function UsersAdmin({ users: initialUsers, currentUserId }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de la création.");
      setSaving(false);
      return;
    }

    setUsers((prev) => [...prev, data]);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "EDITOR" });
    setSaving(false);
    router.refresh();
  };

  const updateRole = async (id: string, role: string) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      router.refresh();
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      router.refresh();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ fontSize: "0.875rem" }}
        >
          {showForm ? "Annuler" : "+ Nouvel utilisateur"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={createUser}
          style={{
            backgroundColor: "white",
            border: "1px solid #e8e0cc",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gap: "1rem",
            maxWidth: "480px",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--color-midnight)" }}>
            Créer un utilisateur
          </h3>
          <div>
            <label style={labelStyle}>Nom</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="form-input"
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="form-input"
            />
          </div>
          <div>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="form-input"
            />
          </div>
          <div>
            <label style={labelStyle}>Rôle</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="form-input"
            >
              <option value="EDITOR">Éditeur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
          {error && (
            <p style={{ color: "var(--color-burgundy)", fontSize: "0.8rem" }}>{error}</p>
          )}
          <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize: "0.875rem" }}>
            {saving ? "Création…" : "Créer"}
          </button>
        </form>
      )}

      <div style={{ backgroundColor: "white", border: "1px solid #e8e0cc", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#faf9f6", borderBottom: "1px solid #e8e0cc" }}>
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Rôle</th>
              <th style={thStyle}>Créé</th>
              <th style={{ padding: "0.75rem 1rem", width: "120px" }} />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #f0ece0" }}>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.9rem", color: "var(--color-midnight)", fontFamily: "var(--font-display)" }}>
                  {user.name}
                  {user.id === currentUserId && (
                    <span style={{ fontSize: "0.7rem", color: "var(--color-text-light)", marginLeft: "0.5rem" }}>
                      (vous)
                    </span>
                  )}
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--color-text-light)" }}>
                  {user.email}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  {user.id === currentUserId ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                      {user.role === "ADMIN" ? "Administrateur" : "Éditeur"}
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      style={{
                        fontSize: "0.8rem",
                        border: "1px solid #e8e0cc",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="EDITOR">Éditeur</option>
                      <option value="ADMIN">Administrateur</option>
                    </select>
                  )}
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => deleteUser(user.id)}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-burgundy)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontFamily: "var(--font-display)",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-text-light)",
  marginBottom: "0.4rem",
};

const thStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-text-light)",
  fontWeight: 600,
};
