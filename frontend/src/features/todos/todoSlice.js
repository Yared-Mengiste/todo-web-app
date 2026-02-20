import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authClient from "../../services/apiClient";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async () => {
    const response = await authClient.get("api/v1/todos");
    return response.data;
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (todo) => {
    const response = await authClient.post("api/v1/todos", todo);
    return response.data;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, updatedTodo }) => {
    const response = await authClient.put(`api/v1/todos/${id}`, updatedTodo);
    return response.data;
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id) => {
    await authClient.delete(`api/v1/todos/${id}`);
    return id;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState: { todos: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodos.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTodos.fulfilled, (state, action) => { state.loading = false; state.todos = action.payload; })
      .addCase(fetchTodos.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      // Add
      .addCase(addTodo.fulfilled, (state, action) => { state.todos.push(action.payload); })

      // Update
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(t => t.id === action.payload.id);
        if(index !== -1) state.todos[index] = action.payload;
      })

      // Delete
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      });
  }
});

export default todosSlice.reducer;
