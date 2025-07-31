package main

import (
	"net/http"
	"time"

	"github.com/casantosmu/todo-app/internal/data"
	"github.com/casantosmu/todo-app/internal/validator"
)

func (app *application) syncHandler(w http.ResponseWriter, r *http.Request) {
	var request data.SyncRequest

	err := app.readJSON(w, r, &request)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()

	if data.ValidateSyncRequest(v, &request); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	response := data.SyncResponse{
		NextTimestamp: time.Now(),
		Changes: data.SyncChanges{
			Tasks: make([]data.Task, 0),
		},
	}

	err = app.writeJSON(w, http.StatusOK, response)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
