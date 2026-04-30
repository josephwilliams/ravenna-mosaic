export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface TagData {
  id: string;
  name: string;
  color: string;
}

export interface CardData {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  position: number;
  tags: { tag: TagData }[];
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
