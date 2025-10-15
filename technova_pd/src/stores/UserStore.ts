// /stores/UserStore.ts
export type TUser = {
  id: string;
  name: string;
  role: string;
  createdAt: number;
  isActive?: boolean;
};

export class UserStore {
  private users: TUser[] = [];

  constructor(initial: TUser[] = []) {
    this.users = initial;
  }

  list() {
    console.log("GET /users simulated");
    return [...this.users];
  }

  findByName(name: string) {
    console.log(`GET /users?name=${name} simulated`);
    return this.users.find(u => u.name === name) || null;
  }

  create(payload: Omit<TUser, "id" | "createdAt"> & { id?: string }) {
    // Simular call POST
    console.log("POST /users simulated");
    const newUser: TUser = {
      id: payload.id || String(Date.now()),
      name: payload.name,
      role: payload.role ?? "user",
      isActive: payload.isActive ?? true,
      createdAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, patch: Partial<TUser>) {
    console.log(`PATCH /users/${id} simulated`);
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("User not found");
    this.users[idx] = { ...this.users[idx], ...patch };
    return this.users[idx];
  }

  remove(id: string) {
    console.log(`DELETE /users/${id} simulated`);
    this.users = this.users.filter(u => u.id !== id);
    return true;
  }
}
