import { useContext } from "react";
import { useForm } from "@mantine/form";
import AuthContext from "../contexts/AuthContext";

import {
  createStyles,
  Group,
  Stack,
  Button,
  TextInput,
  Title,
  PasswordInput
} from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    inputWrapper: {
      width: 250
    }
  };
});

export default function LoginPage() {
  // We get this context to call the login function upon submission of the form
  const auth = useContext(AuthContext);
  const { classes } = useStyles();

  // New Hook for Forms, should function similar to useState Hooks
  const form = useForm({
    initialValues: {
      email: "",
      password: ""
    },
    validate: {
      // checks to see if the value is in the form of a an email
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email")
    }
  });

  function handleSubmit(values) {
    auth.login(values, form);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {/* https://mantine.dev/core/stack/ : basically a vertical flexbox */}
      <Stack align="center" justify="center" p="xl">
        <Title /* Size of Font*/ order={1}>Login/Register</Title>
        <TextInput
          classNames={{ wrapper: classes.inputWrapper }}
          required
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
        />
        <TextInput
          classNames={{ wrapper: classes.inputWrapper }}
          label="Username"
          placeholder="Username if Registering"
          {...form.getInputProps("username")}
        />
        {/* In Class TODO: Find a way to convert this to password field (ie. password hidden) using Mantine */}
        <PasswordInput
          classNames={{ wrapper: classes.inputWrapper }}
          placeholder="Password"
          label="Password"
          required
          {...form.getInputProps("password")}
        />
        {/* https://mantine.dev/core/group : basically a horizontal flexbox*/}
        <Group position="center">
          <Button type="submit">Login/Register</Button>
        </Group>
      </Stack>
    </form>
  );
}
