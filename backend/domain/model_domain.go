package domain

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	CollectionModel = "models"
)

type Model struct {
	ID     primitive.ObjectID `bson:"_id,omitempty"`
	Config bson.M             `bson:"config"`
}

type ModelRepository interface {
	Create(c context.Context, model *Model) (primitive.ObjectID, error)
	GetAll(c context.Context) ([]Model, error)
	GetById(c context.Context, id primitive.ObjectID) (Model, error)
	UpdateById(c context.Context, id primitive.ObjectID, model *Model) (Model, error)
}

type ModelUseCase interface {
	Create(c context.Context, model *Model) (primitive.ObjectID, error)
	GetAll(c context.Context) ([]Model, error)
	GetById(c context.Context, id primitive.ObjectID) (Model, error)
	UpdateById(c context.Context, id primitive.ObjectID, model *Model) (Model, error)
}
