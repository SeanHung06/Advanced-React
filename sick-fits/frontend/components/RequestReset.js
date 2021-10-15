import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });
  console.log(inputs.email, inputs.password);
  const [signup, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      // refetch the current logged in user
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

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
      <h2> Reset Your Password </h2>
      <Error error={error} />

      <fieldset>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success ! Please check your email .</p>
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
        <button type="submit"> Request Reset !</button>
      </fieldset>
    </Form>
  );
}
