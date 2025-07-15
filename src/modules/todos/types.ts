export interface Todo {
  _id?: string;
  _rev?: string;
  title: string;
  completedAt: Date | null;
  createdAt: Date;
}
