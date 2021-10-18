import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      password: $password
      token: $token
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });
  console.log(inputs.email, inputs.password);
  const [reset, { data, loading ,error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;
  // console.log(error)

  // console.log(data);
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting

    console.log(inputs);
    const res = await reset().catch(console.error);
    // console.log(res);
    // console.log({ data, error, loading });
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2> Reset Your Password </h2>
      <Error error={error || successfulError} />

      <fieldset>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success ! You can now signin.</p>
        )}

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
        <button type="submit"> Request Reset !</button>
      </fieldset>
    </Form>
  );
}
