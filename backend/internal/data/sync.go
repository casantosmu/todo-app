package data

import (
	"fmt"
	"time"

	"github.com/casantosmu/todo-app/internal/validator"
)

type SyncChanges struct {
	Tasks []Task `json:"tasks"`
}

type SyncRequest struct {
	LastTimestamp time.Time   `json:"lastTimestamp"`
	Changes       SyncChanges `json:"changes"`
}

type SyncResponse struct {
	NextTimestamp time.Time   `json:"nextTimestamp"`
	Changes       SyncChanges `json:"changes"`
}

func ValidateSyncRequest(v *validator.Validator, request *SyncRequest) {
	v.Check(!request.LastTimestamp.IsZero(), "lastTimestamp", "must be a valid timestamp")

	for i, task := range request.Changes.Tasks {
		v.Check(task.ID != "", fmt.Sprintf("changes.tasks[%d].id", i), "must be provided")
		v.Check(task.Title != "", fmt.Sprintf("changes.tasks[%d].title", i), "must not be empty")
		v.Check(len(task.Title) <= 500, fmt.Sprintf("changes.tasks[%d].title", i), "must not be more than 500 characters")
		v.Check(!task.CreatedAt.IsZero(), fmt.Sprintf("changes.tasks[%d].CreatedAt", i), "must be a valid timestamp")
		v.Check(!task.UpdatedAt.IsZero(), fmt.Sprintf("changes.tasks[%d].UpdatedAt", i), "must be a valid timestamp")
	}
}
