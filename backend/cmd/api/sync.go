package main

import (
	"net/http"
	"time"

	"github.com/casantosmu/todo-app/internal/dto"
	"github.com/casantosmu/todo-app/internal/validator"
)

func (app *application) syncHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	if user.IsAnonymous() {
		app.invalidAuthenticationTokenResponse(w, r)
		return
	}

	var input dto.SyncRequest

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()
	dto.ValidateSyncRequest(v, &input)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	nextTimestamp := time.Now().UTC()

	err = app.models.Task.ApplyChanges(user.ID, input.Changes.Tasks, nextTimestamp)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	taskChanges, err := app.models.Task.GetChangesAfter(user.ID, input.LastTimestamp)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	response := dto.SyncResponse{
		NextTimestamp: nextTimestamp,
		Changes: dto.SyncChanges{
			Tasks: taskChanges,
		},
	}

	err = app.writeJSON(w, http.StatusOK, response)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
