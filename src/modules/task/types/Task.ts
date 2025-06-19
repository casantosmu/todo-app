export default interface Task {
  _id: string;
  type: "task";
  title: string;
  createdAt: Date;
  completedAt: Date | null;
  _rev: string;
}
