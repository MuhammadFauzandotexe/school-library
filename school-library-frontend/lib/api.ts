const API_BASE_URL = "http://localhost:8080/api"

export const api = {
  // Rentals
  async getRentals() {
    const res = await fetch(`${API_BASE_URL}/rentals`)
    if (!res.ok) throw new Error("Failed to fetch rentals")
    const data = await res.json()
    return data.data || []
  },

  async createRental(memberId: number, bookId: string, dueDate: string) {
    const res = await fetch(`${API_BASE_URL}/rentals/rent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, bookId, dueDate }),
    })
    if (!res.ok) throw new Error("Failed to create rental")
    const data = await res.json()
    return data.data
  },

  async returnRental(rentId: number, returnDate: string) {
    const res = await fetch(`${API_BASE_URL}/rentals/return/${rentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returnDate }),
    })
    if (!res.ok) throw new Error("Failed to return rental")
    const data = await res.json()
    return data.data
  },

  // Members
  async getMembers() {
    const res = await fetch(`${API_BASE_URL}/members`)
    if (!res.ok) throw new Error("Failed to fetch members")
    const data = await res.json()
    return data.data || []
  },

  async createMember(name: string, email: string, username: string) {
    const res = await fetch(`${API_BASE_URL}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, username }),
    })
    if (!res.ok) throw new Error("Failed to create member")
    const data = await res.json()
    return data.data
  },

  async updateMember(id: number, name: string, email: string) {
    const res = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
    if (!res.ok) throw new Error("Failed to update member")
    const data = await res.json()
    return data.data
  },

  async deleteMember(id: number) {
    const res = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete member")
  },

  // Books
  async getBooks() {
    const res = await fetch(`${API_BASE_URL}/books`)
    if (!res.ok) throw new Error("Failed to fetch books")
    const data = await res.json()
    return data.data || []
  },

  async createBook(
    isbn: string,
    title: string,
    author: string,
    publisher: string,
    publicationYear: number,
    stock: number,
  ) {
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isbn, title, author, publisher, publicationYear, stock }),
    })
    if (!res.ok) throw new Error("Failed to create book")
    const data = await res.json()
    return data.data
  },

  async updateBook(
    id: number,
    isbn: string,
    title: string,
    author: string,
    publisher: string,
    publicationYear: number,
    stock: number,
  ) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isbn, title, author, publisher, publicationYear, stock }),
    })
    if (!res.ok) throw new Error("Failed to update book")
    const data = await res.json()
    return data.data
  },

  async deleteBook(id: number) {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete book")
  },
}
