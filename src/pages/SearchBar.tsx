// src/components/SearchBar.tsx
import { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: Record<string, string>) => void;
  fields: string[]; // Campos que se pueden filtrar
}

export default function SearchBar({ onSearch, fields }: SearchBarProps) {
  const [values, setValues] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      {fields.map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={`Search by ${field}`}
          value={values[field]}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
        Search
      </button>
    </form>
  );
}