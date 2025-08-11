package data

import (
	"database/sql"
	"errors"
	"regexp"
	"strings"
	"time"

	"github.com/casantosmu/todo-app/internal/validator"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var (
	domainRegex = regexp.MustCompile(`^[a-zA-Z0-9.-]+$`)

	ErrDuplicateEmail = errors.New("duplicate email")
	ErrRecordNotFound = errors.New("record not found")
)

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Password  password  `json:"-"`
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`
}

type password struct {
	plaintext *string
	hash      []byte
}

func (p *password) Set(plainPass string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plainPass), 12)
	if err != nil {
		return err
	}
	p.plaintext = &plainPass
	p.hash = hash
	return nil
}

func (p *password) Matches(plainPass string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(p.hash, []byte(plainPass))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

type UserModel struct {
	DB             *sql.DB
	stmtInsert     *sql.Stmt
	stmtGetByEmail *sql.Stmt
	stmtExists     *sql.Stmt
}

func NewUserModel(db *sql.DB) (*UserModel, error) {
	const insertQuery = `
		INSERT INTO users (id, email, password_hash, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?)`

	stmtInsert, err := db.Prepare(insertQuery)
	if err != nil {
		return nil, err
	}

	const getByEmailQuery = `
		SELECT id, email, password_hash, created_at, updated_at
		FROM users
		WHERE email = ?`

	stmtGetByEmail, err := db.Prepare(getByEmailQuery)
	if err != nil {
		stmtInsert.Close()
		return nil, err
	}

	const existsQuery = `
		SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)`

	stmtExists, err := db.Prepare(existsQuery)
	if err != nil {
		stmtInsert.Close()
		stmtGetByEmail.Close()
		return nil, err
	}

	return &UserModel{
		DB:             db,
		stmtInsert:     stmtInsert,
		stmtGetByEmail: stmtGetByEmail,
		stmtExists:     stmtExists,
	}, nil
}

func (m *UserModel) Insert(user *User) error {
	user.ID = uuid.NewString()
	user.CreatedAt = time.Now().UTC()
	user.UpdatedAt = user.CreatedAt

	_, err := m.stmtInsert.Exec(
		user.ID,
		user.Email,
		user.Password.hash,
		user.CreatedAt,
		user.UpdatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed: users.email") {
			return ErrDuplicateEmail
		}
		return err
	}

	return nil
}

func (m *UserModel) GetByEmail(email string) (*User, error) {
	var user User

	err := m.stmtGetByEmail.QueryRow(email).Scan(
		&user.ID,
		&user.Email,
		&user.Password.hash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrRecordNotFound
		}
		return nil, err
	}

	return &user, nil
}

func (m *UserModel) ExistsByEmail(email string) (bool, error) {
	var exists bool

	err := m.stmtExists.QueryRow(email).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func ValidateEmail(v *validator.Validator, email string) {
	v.Check(email != "", "email", "must be provided")
	v.Check(!strings.ContainsAny(email, "`'\"\\x00"), "email", "contains dangerous characters")
	v.Check(len(email) <= 254, "email", "must not be more than 254 bytes long")

	parts := strings.SplitN(email, "@", 2)

	v.Check(len(parts) == 2, "email", "must be in the format user@domain")
	if len(parts) != 2 {
		return
	}

	localPart := parts[0]
	domainPart := parts[1]

	v.Check(len(localPart) > 0, "email", "must have a local part")
	v.Check(len(localPart) <= 63, "email", "local part must not be more than 63 bytes long")

	v.Check(len(domainPart) > 0, "email", "must have a domain part")
	v.Check(domainRegex.MatchString(domainPart), "email", "domain part contains invalid characters")
}

func ValidatePasswordPlaintext(v *validator.Validator, password string) {
	v.Check(password != "", "password", "must be provided")
	v.Check(len(password) >= 8, "password", "must be at least 8 bytes long")
	v.Check(len(password) <= 72, "password", "must not be more than 72 bytes long")
}

func ValidateUser(v *validator.Validator, user *User) {
	ValidateEmail(v, user.Email)

	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, *user.Password.plaintext)
	}

	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}
