package data

import "database/sql"

type Models struct {
	Task  *TaskModel
	User  *UserModel
	Token *TokenModel
}

func NewModels(db *sql.DB) (*Models, error) {
	taskModel, err := NewTaskModel(db)
	if err != nil {
		return nil, err
	}

	userModel, err := NewUserModel(db)
	if err != nil {
		return nil, err
	}

	tokenModel, err := NewTokenModel(db)
	if err != nil {
		return nil, err
	}

	return &Models{
		Task:  taskModel,
		User:  userModel,
		Token: tokenModel,
	}, nil
}
