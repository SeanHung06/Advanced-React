import Link from 'next/link';
import React from 'react';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();
  console.log(user);
  return (
    <NavStyles>
      <Link href="/products">products</Link>
      {user && (
        <>
          <Link href="/sell">sell</Link>
          <Link href="/order">order</Link>
          <Link href="/account">account</Link>
          <SignOut />
        </>
      )}

      {!user && (
        <>
          <Link href="/signin">SignIn</Link>
        </>
      )}
    </NavStyles>
  );
}
