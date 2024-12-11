package route

import (
	"fma-backend/bootstrap"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func Setup(env *bootstrap.Env, timeout time.Duration, db *mongo.Database, gin *gin.Engine) {
	publicRouter := gin.Group("api/v1.0/")
	ModelRouter(env, timeout, db, publicRouter)
}
