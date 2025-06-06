export default interface Task {
  _id: string;
  title: string;
  completedAt: Date | null;
}
