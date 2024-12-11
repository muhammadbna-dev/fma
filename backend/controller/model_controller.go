package controller

import (
	"fma-backend/bootstrap"
	"fma-backend/domain"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ModelController struct {
	Env          *bootstrap.Env
	ModelUseCase domain.ModelUseCase
}

func (pc *ModelController) GetAll(c *gin.Context) {
	models, err := pc.ModelUseCase.GetAll(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models)
}

func (pc *ModelController) GetById(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid ID format"})
		return
	}

	model, err := pc.ModelUseCase.GetById(c, objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, model)
}

func (pc *ModelController) Post(c *gin.Context) {
	var model domain.Model

	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON",
		})
		return
	}

	modelId, err := pc.ModelUseCase.Create(c, &model)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, modelId)
}

func (pc *ModelController) UpdateById(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid ID format"})
		return
	}

	var model domain.Model
	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON",
		})
		return
	}

	updated, err := pc.ModelUseCase.UpdateById(c, objectID, &model)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, updated)
}
