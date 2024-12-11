package bootstrap

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Env struct {
	AppEnv           string `env:"APP_ENV"`
	DbName           string `env:"DB_NAME"`
	DbHost           string `env:"DB_HOST"`
	DbPort           int    `env:"DB_PORT"`
	DbUser           string `env:"DB_USER"`
	DbPass           string `env:"DB_PASS"`
	DbContextTimeout int    `env:"DB_CONTEXT_TIMEOUT"`
}

func getEnvStr(key string, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	str := os.Getenv(key)
	if str == "" {
		return defaultVal
	}

	val, err := strconv.Atoi(str)
	if err != nil {
		log.Fatal("Env variable should be a number: ", key)
	}
	return val
}

func LoadEnv() *Env {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	var env = Env{}
	env.AppEnv = getEnvStr("APP_ENV", "dev")
	env.DbName = getEnvStr("DB_NAME", "fma")
	env.DbHost = getEnvStr("DB_HOST", "0.0.0.0")
	env.DbPort = getEnvInt("DB_PORT", 27017)
	env.DbUser = getEnvStr("DB_USER", "")
	env.DbPass = getEnvStr("DB_PASS", "")
	env.DbContextTimeout = getEnvInt("DB_CONTEXT_TIMEOUT", 3)
	return &env
}
