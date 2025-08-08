package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(app.notFoundResponse)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodPost, "/api/sync", app.syncHandler)
	router.HandlerFunc(http.MethodPost, "/api/users", app.registerUserHandler)

	return app.recoverPanic(app.enableCORS(router))
}
