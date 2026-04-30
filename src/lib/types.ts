export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface CardData {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  position: number;
}

export interface ColumnData {
  id: string;
  title: string;
  position: number;
  cards: CardData[];
}

export interface BoardData {
  id: string;
  title: string;
  columns: ColumnData[];
}
