package data

import (
	"database/sql"
	"time"
)

type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	CompletedAt *time.Time `json:"completedAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `json:"deletedAt"`
	SyncedAt    string     `json:"-"`
}

type TaskModel struct {
	DB              *sql.DB
	stmtGetChanges  *sql.Stmt
	stmtApplyChange *sql.Stmt
}

func NewTaskModel(db *sql.DB) (*TaskModel, error) {
	const getChangesQuery = `
		SELECT id, title, completed_at, created_at, updated_at, deleted_at, synced_at
		FROM tasks
		WHERE synced_at > ?
		ORDER BY synced_at ASC;
	`
	stmtGetChanges, err := db.Prepare(getChangesQuery)
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			stmtGetChanges.Close()
		}
	}()

	const applyChangeQuery = `
		INSERT INTO tasks (id, title, completed_at, created_at, updated_at, deleted_at, synced_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT (id) DO UPDATE SET
			title = excluded.title,
			completed_at = excluded.completed_at,
			updated_at = excluded.updated_at,
			deleted_at = excluded.deleted_at,
			synced_at = excluded.synced_at
		WHERE excluded.updated_at > tasks.updated_at;
	`
	stmtApplyChange, err := db.Prepare(applyChangeQuery)
	if err != nil {
		return nil, err
	}

	return &TaskModel{
		DB:              db,
		stmtGetChanges:  stmtGetChanges,
		stmtApplyChange: stmtApplyChange,
	}, nil
}

func (m *TaskModel) GetChangesAfter(lastTimestamp time.Time) ([]Task, error) {
	tasks := []Task{}

	rows, err := m.stmtGetChanges.Query(lastTimestamp)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var task Task
		var completedAt sql.NullTime
		var deletedAt sql.NullTime

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&completedAt,
			&task.CreatedAt,
			&task.UpdatedAt,
			&deletedAt,
			&task.SyncedAt,
		)
		if err != nil {
			return nil, err
		}

		if completedAt.Valid {
			task.CompletedAt = &completedAt.Time
		}
		if deletedAt.Valid {
			task.DeletedAt = &deletedAt.Time
		}

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (m *TaskModel) ApplyChanges(tasks []Task, nextTimestamp time.Time) error {
	if len(tasks) == 0 {
		return nil
	}

	tx, err := m.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	txStmtApplyChange := tx.Stmt(m.stmtApplyChange)

	for _, task := range tasks {
		var completedAt sql.NullTime
		if task.CompletedAt != nil {
			completedAt = sql.NullTime{Time: *task.CompletedAt, Valid: true}
		}

		var deletedAt sql.NullTime
		if task.DeletedAt != nil {
			deletedAt = sql.NullTime{Time: *task.DeletedAt, Valid: true}
		}

		_, err := txStmtApplyChange.Exec(
			task.ID,
			task.Title,
			completedAt,
			task.CreatedAt,
			task.UpdatedAt,
			deletedAt,
			nextTimestamp,
		)

		if err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
