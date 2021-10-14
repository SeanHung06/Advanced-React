import Link from 'next/link';
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
        </>
      )}

      {!user && (
        <>
          <Link href="/SignIn">SignIn</Link>
        </>
      )}
    </NavStyles>
  );
}
