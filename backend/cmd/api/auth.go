package main

import (
	"errors"
	"net/http"
	"time"

	"github.com/casantosmu/todo-app/internal/data"
	"github.com/casantosmu/todo-app/internal/dto"
	"github.com/casantosmu/todo-app/internal/validator"
)

func (app *application) registerHandler(w http.ResponseWriter, r *http.Request) {
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

func (app *application) loginHandler(w http.ResponseWriter, r *http.Request) {
	var input dto.LoginInput

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	v := validator.New()
	dto.ValidateLoginInput(v, &input)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	user, err := app.models.User.GetByEmail(input.Email)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			app.invalidCredentialsResponse(w, r)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	match, err := user.Password.Matches(input.Password)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if !match {
		app.invalidCredentialsResponse(w, r)
		return
	}

	ttl := 90 * 24 * time.Hour // Token valid for 90 days
	token, err := app.models.Token.New(user.ID, ttl, data.ScopeAuthentication)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, token)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) logoutHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)
	if user.IsAnonymous() {
		app.authenticationRequiredResponse(w, r)
		return
	}

	token := app.contextGetToken(r)

	err := app.models.Token.Delete(token)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
