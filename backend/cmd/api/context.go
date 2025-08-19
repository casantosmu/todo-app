package main

import (
	"context"
	"net/http"

	"github.com/casantosmu/todo-app/internal/data"
)

type contextKey string

const (
	userContextKey  = contextKey("user")
	tokenContextKey = contextKey("token")
)

func (app *application) contextSetUser(r *http.Request, user *data.User) *http.Request {
	ctx := context.WithValue(r.Context(), userContextKey, user)
	return r.WithContext(ctx)
}

func (app *application) contextGetUser(r *http.Request) *data.User {
	user, ok := r.Context().Value(userContextKey).(*data.User)
	if !ok {
		panic("missing user value in request context")
	}
	return user
}

func (app *application) contextSetToken(r *http.Request, tokenPlaintext string) *http.Request {
	ctx := context.WithValue(r.Context(), tokenContextKey, tokenPlaintext)
	return r.WithContext(ctx)
}

func (app *application) contextGetToken(r *http.Request) string {
	tokenPlaintext, ok := r.Context().Value(tokenContextKey).(string)
	if !ok {
		return ""
	}
	return tokenPlaintext
}
