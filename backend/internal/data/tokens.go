package data

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base32"
	"encoding/hex"
	"time"
)

const (
	ScopeAuthentication = "authentication"
)

type Token struct {
	Plaintext string    `json:"token"`
	Hash      string    `json:"-"`
	UserID    string    `json:"-"`
	Scope     string    `json:"-"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"-"`
}

func generateToken(userID string, ttl time.Duration, scope string) (*Token, error) {
	now := time.Now()

	token := &Token{
		UserID:    userID,
		Scope:     scope,
		ExpiresAt: now.Add(ttl),
		CreatedAt: now,
	}

	randomBytes := make([]byte, 16)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return nil, err
	}

	token.Plaintext = base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(randomBytes)

	hash := sha256.Sum256([]byte(token.Plaintext))
	token.Hash = hex.EncodeToString(hash[:])

	return token, nil
}

type TokenModel struct {
	DB         *sql.DB
	stmtInsert *sql.Stmt
}

func NewTokenModel(db *sql.DB) (*TokenModel, error) {
	const insertQuery = `
		INSERT INTO tokens (hash, user_id, scope, expires_at, created_at)
		VALUES (?, ?, ?, ?, ?)`

	stmtInsert, err := db.Prepare(insertQuery)
	if err != nil {
		return nil, err
	}

	return &TokenModel{
		DB:         db,
		stmtInsert: stmtInsert,
	}, nil
}

func (m *TokenModel) Insert(token *Token) error {
	_, err := m.stmtInsert.Exec(
		token.Hash,
		token.UserID,
		token.Scope,
		token.ExpiresAt,
		token.CreatedAt,
	)
	return err
}

func (m *TokenModel) New(userID string, ttl time.Duration, scope string) (*Token, error) {
	token, err := generateToken(userID, ttl, scope)
	if err != nil {
		return nil, err
	}

	err = m.Insert(token)
	if err != nil {
		return nil, err
	}

	return token, nil
}
