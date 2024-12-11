package route

import (
	"fma-backend/bootstrap"
	"fma-backend/controller"
	"fma-backend/domain"
	"fma-backend/repository"
	"fma-backend/usecase"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func ModelRouter(env *bootstrap.Env, timeout time.Duration, db *mongo.Database, group *gin.RouterGroup) {
	baseRoute := "model/"
	mr := repository.ModelRepository(db, domain.CollectionModel)
	mc := &controller.ModelController{
		ModelUseCase: usecase.ModelUseCase(mr, timeout),
		Env:          env,
	}
	group.GET(baseRoute, mc.GetAll)
	group.GET(baseRoute+":id", mc.GetById)
	group.POST(baseRoute, mc.Post)
	group.PUT(baseRoute+":id", mc.UpdateById)
}
