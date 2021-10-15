import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });
  console.log(inputs.email, inputs.password);
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
    // refetch the current logged in user
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  console.log(data);
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting

    console.log(inputs);
    const res = await signup().catch(console.error);
    console.log(res);
    console.log({ data, error, loading });
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2> Sign Into Your Account! </h2>
      <Error error={error} />

      <fieldset>
        {data?.createUser && (
          <p>
            Sign Up with {data.createUser.email} - Please go and Sign In !!!
          </p>
        )}
        <label htmlFor="name">
          Name
          <input
            type="name"
            name="name"
            placeholder="Your Name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit"> Sign In !</button>
      </fieldset>
    </Form>
  );
}
