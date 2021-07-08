import Link from 'next/link';
import NavStyles from './styles/NavStyles';

export default function Nav() {
  return (
    <NavStyles>
      <Link href="/products">products</Link>
      <Link href="/sell">sell</Link>
      <Link href="/order">order</Link>
      <Link href="/account">account</Link>
    </NavStyles>
  );
}
