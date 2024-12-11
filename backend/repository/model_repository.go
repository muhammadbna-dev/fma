package repository

import (
	"context"
	"fma-backend/domain"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type modelRepository struct {
	database   *mongo.Database
	collection string
}

func ModelRepository(db *mongo.Database, collection string) domain.ModelRepository {
	return &modelRepository{
		database:   db,
		collection: collection,
	}
}

func (mr *modelRepository) Create(c context.Context, model *domain.Model) (primitive.ObjectID, error) {
	collection := mr.database.Collection(mr.collection)
	result, err := collection.InsertOne(c, model)
	if err != nil {
		return primitive.NilObjectID, err
	}

	id, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("failed to cast inserted ID to ObjectID")
	}

	return id, nil
}

func (mr *modelRepository) GetAll(c context.Context) ([]domain.Model, error) {
	collection := mr.database.Collection(mr.collection)
	cursor, err := collection.Find(c, bson.D{})
	if err != nil {
		return nil, err
	}

	var models []domain.Model
	err = cursor.All(c, &models)
	defer func() {
		if err := cursor.Close(c); err != nil {
			panic(fmt.Sprintf("Failed to close cursor %s", err))
		}
	}()
	if models == nil {
		return []domain.Model{}, err
	}

	return models, err
}

func (mr *modelRepository) GetById(c context.Context, id primitive.ObjectID) (domain.Model, error) {
	collection := mr.database.Collection(mr.collection)
	var result domain.Model
	err := collection.FindOne(c, bson.M{"_id": id}).Decode(&result)
	if err != nil {
		return domain.Model{}, err
	}

	return result, nil
}

func (mr *modelRepository) UpdateById(c context.Context, id primitive.ObjectID, model *domain.Model) (domain.Model, error) {
	collection := mr.database.Collection(mr.collection)
	var result domain.Model
	err := collection.FindOneAndReplace(c, bson.M{"_id": id}, model, options.FindOneAndReplace().SetReturnDocument(options.After)).Decode(&result)
	if err != nil {
		return domain.Model{}, err
	}

	return result, nil
}
