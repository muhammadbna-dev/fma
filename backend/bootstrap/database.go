package bootstrap

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func InitMongo(env *Env) *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(env.DbContextTimeout)*time.Second)
	defer cancel()

	dbHost := env.DbHost
	dbPort := env.DbPort
	dbUser := env.DbUser
	dbPass := env.DbPass
	mongoUri := fmt.Sprintf("mongodb://%s:%s@%s:%d", dbUser, dbPass, dbHost, dbPort)
	if dbUser == "" || dbPass == "" {
		mongoUri = fmt.Sprintf("mongodb://%s:%d", dbHost, dbPort)
	}
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))

	if err != nil {
		panic(fmt.Sprintf("Mongo DB Connect issue %s", err))
	}
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		panic(fmt.Sprintf("Mongo DB ping issue %s", err))
	}
	return client

}

func CloseMongoConn(client mongo.Client) {
	if err := client.Disconnect(context.Background()); err != nil {
		panic(err)
	}
	log.Println("Connection to MongoDB closed.")
}
