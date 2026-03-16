"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PASSWORD_RULES } from "@/utils/password";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const failed = PASSWORD_RULES.filter((r) => !r.test(form.password));
    if (failed.length > 0) {
      setError("Mot de passe trop faible : " + failed.map((r) => r.label).join(", ") + ".");
      return;
    }
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

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, password: "", role: user.role });
    setEditError("");
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.password) {
      const failed = PASSWORD_RULES.filter((r) => !r.test(editForm.password));
      if (failed.length > 0) {
        setEditError("Mot de passe trop faible : " + failed.map((r) => r.label).join(", ") + ".");
        return;
      }
    }
    setSaving(true);
    setEditError("");

    const body: Record<string, string> = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
    };
    if (editForm.password) body.password = editForm.password;

    const res = await fetch(`/api/users/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setEditError(data.error || "Erreur lors de la sauvegarde.");
      return;
    }

    setUsers((prev) => prev.map((u) => (u.id === editingId ? data : u)));
    setEditingId(null);
    router.refresh();
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
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="form-input"
            />
            {form.password.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem", display: "grid", gap: "0.25rem" }}>
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(form.password);
                  return (
                    <li key={rule.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: ok ? "#166534" : "var(--color-burgundy)" }}>
                      <span>{ok ? "✓" : "✗"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
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
              <>
                <tr key={user.id} style={{ borderBottom: editingId === user.id ? "none" : "1px solid #f0ece0" }}>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.9rem", color: "var(--color-midnight)", fontFamily: "var(--font-display)" }}>
                    {user.name}
                    {user.id === currentUserId && (
                      <span style={{ fontSize: "0.7rem", color: "var(--color-text-light)", marginLeft: "0.5rem" }}>(vous)</span>
                    )}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "var(--color-text-light)" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                    {user.role === "ADMIN" ? "Administrateur" : "Éditeur"}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "0.875rem 1rem", display: "flex", gap: "0.75rem" }}>
                    {user.id !== currentUserId && (
                      <>
                        <button
                          onClick={() => editingId === user.id ? setEditingId(null) : startEdit(user)}
                          style={{ fontSize: "0.75rem", color: "var(--color-midnight)", background: "none", border: "none", cursor: "pointer" }}
                        >
                          {editingId === user.id ? "Annuler" : "Éditer"}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          style={{ fontSize: "0.75rem", color: "var(--color-burgundy)", background: "none", border: "none", cursor: "pointer" }}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {editingId === user.id && (
                  <tr key={`edit-${user.id}`} style={{ borderBottom: "1px solid #f0ece0", backgroundColor: "#faf9f6" }}>
                    <td colSpan={5} style={{ padding: "1.25rem 1rem" }}>
                      <form onSubmit={saveEdit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "0.75rem", alignItems: "end" }}>
                        <div>
                          <label style={labelStyle}>Nom</label>
                          <input type="text" required value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="form-input" />
                        </div>
                        <div>
                          <label style={labelStyle}>Email</label>
                          <input type="email" required value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="form-input" />
                        </div>
                        <div>
                          <label style={labelStyle}>Nouveau mot de passe</label>
                          <input type="password" placeholder="Laisser vide pour ne pas changer" value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} className="form-input" />
                          {editForm.password.length > 0 && (
                            <ul style={{ listStyle: "none", padding: 0, marginTop: "0.4rem", display: "grid", gap: "0.2rem" }}>
                              {PASSWORD_RULES.map((rule) => {
                                const ok = rule.test(editForm.password);
                                return (
                                  <li key={rule.label} style={{ fontSize: "0.7rem", color: ok ? "#166534" : "var(--color-burgundy)", display: "flex", gap: "0.3rem" }}>
                                    <span>{ok ? "✓" : "✗"}</span>{rule.label}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                        <div>
                          <label style={labelStyle}>Rôle</label>
                          <select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} className="form-input">
                            <option value="EDITOR">Éditeur</option>
                            <option value="ADMIN">Administrateur</option>
                          </select>
                        </div>
                        <div style={{ paddingBottom: editForm.password.length > 0 ? "6.5rem" : "0" }}>
                          <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                            {saving ? "…" : "Sauvegarder"}
                          </button>
                        </div>
                      </form>
                      {editError && <p style={{ color: "var(--color-burgundy)", fontSize: "0.8rem", marginTop: "0.5rem" }}>{editError}</p>}
                    </td>
                  </tr>
                )}
              </>
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
