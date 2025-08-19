package main

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

//go:embed ui/*
var uiFiles embed.FS

func (app *application) routes() (http.Handler, error) {
	uiFS, err := fs.Sub(uiFiles, "ui")
	if err != nil {
		return nil, err
	}

	router := httprouter.New()

	router.NotFound = http.FileServerFS(uiFS)
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	router.HandlerFunc(http.MethodPost, "/api/sync", app.syncHandler)
	router.HandlerFunc(http.MethodPost, "/api/auth/register", app.registerHandler)
	router.HandlerFunc(http.MethodPost, "/api/auth/login", app.loginHandler)

	return app.recoverPanic(app.enableCORS(app.authenticate(router))), nil
}
