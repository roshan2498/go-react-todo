package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Done   bool   `json:"done"`
	Body   string `json:"body"`
	Delete bool   `json:"delete"`
}

func main() {
	fmt.Println("Hello, world!")

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin,Content-Type,Accept ",
	}))

	todos := []Todo{}

	app.Get("/healthCheck", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})
	// add new todos
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}
		err := c.BodyParser(todo)
		if err != nil {
			return err
		}
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)
		return c.JSON(todos)
	})

	// mark todo done
	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid ID")
		}

		for i, todo := range todos {
			if todo.ID == id {
				todos[i].Done = true
			}
		}

		return c.JSON(todos)
	})

	//delete todo
	app.Patch("/api/todos/:id/delete", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(401).SendString("Invalid ID")
		}

		for i, todo := range todos {
			if todo.ID == id {
				todos[i].Delete = true
			}
		}

		return c.JSON(todos)
	})

	// get all todos

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":8080"))
}
