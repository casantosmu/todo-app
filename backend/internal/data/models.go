package data

import "database/sql"

type Models struct {
	Task *TaskModel
}

func NewModels(db *sql.DB) (*Models, error) {
	taskModel, err := NewTaskModel(db)
	if err != nil {
		return nil, err
	}

	return &Models{
		Task: taskModel,
	}, nil
}
