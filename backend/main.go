package main

import (
	"fma-backend/bootstrap"
	"fma-backend/route"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	app := bootstrap.App()
	env := app.Env

	db := app.Mongo.Database(env.DbName)
	defer app.CloseDbConn()

	gin := gin.Default()
	timeout := time.Duration(env.DbContextTimeout) * time.Second
	route.Setup(env, timeout, db, gin)
	err := gin.Run()
	if err != nil {
		panic(err)
	}
}
