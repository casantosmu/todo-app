package dto

import "github.com/casantosmu/todo-app/internal/validator"

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignupInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func ValidateLoginInput(v *validator.Validator, input *LoginInput) {
	v.ValidateEmail(input.Email)
	v.Check(input.Password != "", "password", "must be provided")
}

func ValidateSignupInput(v *validator.Validator, input *SignupInput) {
	v.ValidateEmail(input.Email)

	v.Check(input.Password != "", "password", "must be provided")
	v.Check(len(input.Password) >= 8, "password", "must be at least 8 bytes long")
	v.Check(len(input.Password) <= 72, "password", "must not be more than 72 bytes long")
}
