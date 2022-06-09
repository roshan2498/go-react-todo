import { Box, ListItem, List, ThemeIcon } from "@mantine/core";
import "./App.css";
import useSWR, { mutate } from "swr";
import AddTodo from "./Components/AddTodo";
import { CheckCircleFillIcon, RepoDeletedIcon } from "@primer/octicons-react";

export const ENDPOINT = "http://localhost:8080";

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

export interface TODO {
  id: number;
  title: string;
  done: boolean;
  body: string;
  delete: boolean;
}

const App = () => {
  const { data, mutate } = useSWR("api/todos", fetcher);
  const markTodoAsDone = async (id: number) => {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: "PATCH",
    }).then((r) => r.json());

    mutate(updated);
  };

  const markTodoAsDelete = async (id: number) => {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/delete`, {
      method: "PATCH",
    }).then((r) => r.json());

    mutate(updated);
  };
  return (
    <div>
      <Box
        sx={(theme) => ({
          padding: "1.2rem",
          width: "100%",
          maxWidth: "40rem",
          margin: "0 auto",
        })}
      >
        <AddTodo mutate={mutate} />
        <List spacing="xs" size="sm" mb={12} center>
          {data?.map((todo: TODO) => {
            return (
              <>
                {!todo.delete && (
                  <>
                    <ListItem
                      onClick={() => markTodoAsDone(todo.id)}
                      key={`todo_list__.${todo.id}`}
                      icon={
                        todo.done ? (
                          <ThemeIcon color="green" size={24} radius="xl">
                            <CheckCircleFillIcon />
                          </ThemeIcon>
                        ) : (
                          <ThemeIcon color="gray" size={24} radius="xl">
                            <CheckCircleFillIcon />
                          </ThemeIcon>
                        )
                      }
                    >
                      <h3>{todo.title}</h3>
                      <p>{todo.body}</p>
                    </ListItem>
                    <ThemeIcon
                      onClick={() => markTodoAsDelete(todo.id)}
                      color="red"
                      size={24}
                      radius="xl"
                    >
                      <RepoDeletedIcon />
                    </ThemeIcon>
                  </>
                )}
              </>
            );
          })}
        </List>
      </Box>
    </div>
  );
};

export default App;
