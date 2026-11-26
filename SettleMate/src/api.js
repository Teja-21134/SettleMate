const STORAGE_KEYS = {
  purchases: "settlemate_demo_purchases",
  satyavamma: "settlemate_demo_satyavamma",
};

const DEMO_USERNAME = "guest";
const DEMO_PASSWORD = "guest@123";

function readEntries(key) {
  try {
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function getCurrentUser() {
  const token = sessionStorage.getItem("settlemateToken");
  const username = localStorage.getItem("loggedInUser");
  if (!token || !username) {
    throw { response: { status: 401, data: { message: "Please log in again." } } };
  }
  return username;
}

function getCollection(url) {
  if (url.startsWith("/api/purchases")) return STORAGE_KEYS.purchases;
  if (url.startsWith("/api/satyavamma")) return STORAGE_KEYS.satyavamma;
  return null;
}

function response(data) {
  return { data };
}

const api = {
  async post(url, body = {}) {
    if (url === "/api/auth/login") {
      if (body.username !== DEMO_USERNAME || body.password !== DEMO_PASSWORD) {
        throw {
          response: {
            status: 401,
            data: { message: "Use the demo login: guest / guest@123." },
          },
        };
      }
      return response({ token: `local-demo-${Date.now()}`, username: DEMO_USERNAME });
    }

    const key = getCollection(url);
    if (!key) throw { response: { status: 404, data: { message: "Not found." } } };
    const username = getCurrentUser();
    const entries = readEntries(key);
    const entry = {
      ...body,
      _id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      username,
    };
    localStorage.setItem(key, JSON.stringify([entry, ...entries]));
    return response(entry);
  },

  async get(url) {
    const key = getCollection(url);
    if (!key) throw { response: { status: 404, data: { message: "Not found." } } };
    const username = getCurrentUser();
    const entries = readEntries(key).filter((entry) => entry.username === username);
    return response(entries);
  },

  async put(url, body = {}) {
    const key = getCollection(url);
    if (!key) throw { response: { status: 404, data: { message: "Not found." } } };
    const username = getCurrentUser();
    const id = decodeURIComponent(url.split("/").pop());
    const entries = readEntries(key);
    const index = entries.findIndex((entry) => entry._id === id && entry.username === username);
    if (index < 0) throw { response: { status: 404, data: { message: "Entry not found." } } };
    const updated = { ...entries[index], ...body, _id: id, username };
    entries[index] = updated;
    localStorage.setItem(key, JSON.stringify(entries));
    return response(updated);
  },

  async delete(url) {
    const key = getCollection(url);
    if (!key) throw { response: { status: 404, data: { message: "Not found." } } };
    const username = getCurrentUser();
    const id = decodeURIComponent(url.split("/").pop());
    const entries = readEntries(key);
    const remaining = entries.filter((entry) => !(entry._id === id && entry.username === username));
    if (remaining.length === entries.length) {
      throw { response: { status: 404, data: { message: "Entry not found." } } };
    }
    localStorage.setItem(key, JSON.stringify(remaining));
    return response({ message: "Entry deleted." });
  },
};

export default api;
