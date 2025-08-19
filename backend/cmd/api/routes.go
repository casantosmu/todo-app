package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.FileServer(http.Dir("ui"))
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodPost, "/api/sync", app.syncHandler)
	router.HandlerFunc(http.MethodPost, "/api/auth/register", app.registerHandler)
	router.HandlerFunc(http.MethodPost, "/api/auth/login", app.loginHandler)
	router.HandlerFunc(http.MethodPost, "/api/auth/logout", app.logoutHandler)

	return app.recoverPanic(app.enableCORS(app.authenticate(router)))
}
