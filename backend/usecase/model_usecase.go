package usecase

import (
	"context"
	"fma-backend/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type modelUseCase struct {
	modelRepository domain.ModelRepository
	contextTimeout  time.Duration
}

func ModelUseCase(modelRepository domain.ModelRepository, timeout time.Duration) domain.ModelUseCase {
	return &modelUseCase{
		modelRepository: modelRepository,
		contextTimeout:  timeout,
	}
}

func (mu *modelUseCase) Create(c context.Context, model *domain.Model) (primitive.ObjectID, error) {
	ctx, cancel := context.WithTimeout(c, mu.contextTimeout)
	defer cancel()
	return mu.modelRepository.Create(ctx, model)
}

func (mu *modelUseCase) GetAll(c context.Context) ([]domain.Model, error) {
	ctx, cancel := context.WithTimeout(c, mu.contextTimeout)
	defer cancel()
	return mu.modelRepository.GetAll(ctx)
}

func (mu *modelUseCase) GetById(c context.Context, id primitive.ObjectID) (domain.Model, error) {
	ctx, cancel := context.WithTimeout(c, mu.contextTimeout)
	defer cancel()
	return mu.modelRepository.GetById(ctx, id)
}

func (mu *modelUseCase) UpdateById(c context.Context, id primitive.ObjectID, model *domain.Model) (domain.Model, error) {
	ctx, cancel := context.WithTimeout(c, mu.contextTimeout)
	defer cancel()
	return mu.modelRepository.UpdateById(ctx, id, model)
}
