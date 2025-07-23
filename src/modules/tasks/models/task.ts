export interface Task {
  id: string;
  title: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // The derived fields for efficient querying.
  isCompleted: 0 | 1;
  isDeleted: 0 | 1;
}

export const TASK_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
} as const;

export const DELETED_STATUS = {
  NOT_DELETED: 0,
  DELETED: 1,
} as const;
