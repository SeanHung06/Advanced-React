import { gql, useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config.js';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  const { count } = data._allProductsMeta;

  const pageCount = Math.ceil(count / perPage);
  console.log(count, pageCount);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  return (
    <PaginationStyles>
      <Head>
        <title>Sick Fits - Page {page} of __ </title>
      </Head>

      <Link href={`/product/${page - 1}`}>
        <a aria-disabled={page <= 1}> Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p> {count} Items Total</p>
      <Link href={`/product/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next</a>
      </Link>
    </PaginationStyles>
  );
}
