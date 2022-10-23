import { Text, Paper, Button } from "@mantine/core";

import { GoogleIcon } from "../icons";

export function AuthPage(props) {
  return (
    <div className="col-lg-4 mx-auto text-center p-5">
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg">Welcome to Invoice App</Text>
        <Button
          radius="xl"
          className="my-4"
          leftIcon={<GoogleIcon />}
          variant="default"
          color="gray"
        >
          Login With Google
        </Button>
      </Paper>
    </div>
  );
}
