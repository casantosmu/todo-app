package main

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/casantosmu/todo-app/internal/data"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	_ "github.com/mattn/go-sqlite3"
)

type application struct {
	logger *slog.Logger
	models *data.Models
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./data/db.sqlite"
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	db, err := openDB(dbPath)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	defer db.Close()

	logger.Info("database connection pool established")

	if err := migrateDB(db); err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	logger.Info("database migrations applied")

	models, err := data.NewModels(db)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	app := &application{logger, models}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorLog:     slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	logger.Info("starting server", "address", srv.Addr)

	err = srv.ListenAndServe()
	logger.Error(err.Error())
	os.Exit(1)
}

func openDB(dbPath string) (*sql.DB, error) {
	dir := filepath.Dir(dbPath)

	err := os.MkdirAll(dir, 0755)
	if err != nil {
		return nil, fmt.Errorf("failed to create database directory: %w", err)
	}

	dsn := fmt.Sprintf("%s?_journal_mode=WAL&_synchronous=NORMAL&_foreign_keys=on", dbPath)

	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func migrateDB(db *sql.DB) error {
	migrationDriver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		return err
	}
	migrator, err := migrate.NewWithDatabaseInstance("file://./migrations", "sqlite3", migrationDriver)
	if err != nil {
		return err
	}
	err = migrator.Up()
	if err != nil && err != migrate.ErrNoChange {
		return err
	}
	return nil
}
