package bootstrap

import "go.mongodb.org/mongo-driver/mongo"

type Application struct {
	Env   *Env
	Mongo mongo.Client
}

func App() Application {
	app := &Application{}
	app.Env = LoadEnv()
	app.Mongo = *InitMongo(app.Env)
	return *app
}

func (app *Application) CloseDbConn() {
	CloseMongoConn(app.Mongo)
}
