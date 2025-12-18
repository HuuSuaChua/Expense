export type Category = {
  id: number;
  name: string;
  type: "IN" | "OUT";
};

export type Warehouse = {
  id: number;
  amount: number;
  note: string | null;
  category: Category;
  created_at: string;
};
