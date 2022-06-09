import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { ENDPOINT, TODO } from "../App";

const AddTodo = ({ mutate }: { mutate: KeyedMutator<TODO[]> }) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    initialValues: {
      title: "",
      body: "",
    },
  });

  const createTodo = async (values: { title: string; body: string }) => {
    const updated = await fetch(`${ENDPOINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((r) => r.json());

    mutate(updated);
    form.reset();
    setOpen(false);
  };

  return (
    <>
      <Modal opened={open} title="Create Todo" onClose={() => setOpen(false)}>
        <form onSubmit={form.onSubmit(createTodo)}>
          <TextInput
            mb={10}
            placeholder="What do you want to do ?"
            required
            label="Todo"
            {...form.getInputProps("title")}
          />
          <Textarea
            mb={10}
            placeholder="Tell me more..."
            required
            label="Body"
            {...form.getInputProps("body")}
          />
          <Button type="submit">Create Todo</Button>
        </form>
      </Modal>
      <Group position="center">
        <Button fullWidth mb={12} onClick={() => setOpen(true)}>
          ADD TODO
        </Button>
      </Group>
    </>
  );
};

export default AddTodo;
