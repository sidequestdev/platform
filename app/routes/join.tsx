import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import React from "react";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof firstName !== "string") {
    return json<ActionData>(
      { errors: { firstName: "First name is invalid" } },
      { status: 400 }
    );
  }

  if (typeof lastName !== "string") {
    return json<ActionData>(
      { errors: { lastName: "Last name is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (typeof confirmPassword !== "string") {
    return json<ActionData>(
      { errors: { confirmPassword: "Password confirmation is required" } },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return json<ActionData>(
      { errors: { confirmPassword: "Password confirmation does not match" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser({ firstName, lastName, email, password });

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const passwordConfirmRef = React.useRef<HTMLInputElement>(null);
  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Create an Account
      </Title>

      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor component={Link} to="/login" size="sm">
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form method="post">
          <TextInput
            ref={firstNameRef}
            label="First Name"
            name="firstName"
            placeholder="First Name"
            autoFocus={true}
            id="firstName"
            type="text"
            error={actionData?.errors?.firstName}
            required
          />

          <TextInput
            ref={lastNameRef}
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
            id="LastName"
            type="text"
            error={actionData?.errors?.lastName}
            mt="md"
          />

          <TextInput
            ref={emailRef}
            label="Email"
            name="email"
            placeholder="you@domain.com"
            id="email"
            type="email"
            autoComplete="email"
            error={actionData?.errors?.email}
            required
            mt="md"
          />

          <PasswordInput
            ref={passwordRef}
            label="Password"
            id="password"
            name="password"
            placeholder="Your password"
            autoComplete="new-password"
            required
            error={actionData?.errors?.password}
            mt="md"
          />

          <PasswordInput
            ref={passwordConfirmRef}
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
            error={actionData?.errors?.confirmPassword}
            mt="md"
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button fullWidth mt="xl" type="submit">
            Create Account
          </Button>
        </Form>
      </Paper>
    </Container>
  );
}
