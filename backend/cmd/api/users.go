package main

import (
	"errors"
	"net/http"

	"github.com/casantosmu/todo-app/internal/data"
	"github.com/casantosmu/todo-app/internal/dto"
	"github.com/casantosmu/todo-app/internal/validator"
)

func (app *application) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var input dto.SignupInput

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()
	dto.ValidateSignupInput(v, &input)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	user := &data.User{
		Email: input.Email,
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.models.User.Insert(user)
	if err != nil {
		if errors.Is(err, data.ErrDuplicateEmail) {
			v.AddError("email", "a user with this email address already exists")
			app.failedValidationResponse(w, r, v.Errors)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusCreated, user)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
