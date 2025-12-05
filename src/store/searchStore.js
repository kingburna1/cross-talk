// Assuming this is the content of: ../../store/searchStore.js
import { create } from "zustand";

export const useSearchStore = create((set) => ({
    // State property
    search: "",
    // Setter function (renamed for clarity/consistency, although your original was okay)
    setSearch: (value) => set({ search: value }),
}));