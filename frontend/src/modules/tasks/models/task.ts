export interface Task {
  id: string;
  title: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Dexie/IndexedDB cannot index boolean or null values directly. These derived
  // numeric fields (0/1) are used to create efficient compound indexes for querying.
  isCompleted: 0 | 1;
  isDeleted: 0 | 1;
}

export const TASK_DERIVED_FIELDS = ["isCompleted", "isDeleted"] as const;

export const TASK_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
} as const;

export const DELETED_STATUS = {
  NOT_DELETED: 0,
  DELETED: 1,
} as const;
