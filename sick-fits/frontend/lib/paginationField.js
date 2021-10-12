import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tell apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log(existing, args, cache);

      const { skip, first } = args;

      // Read the number of items on the page from the cache

      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items

      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If last page are not enough for the whole pages
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // we don't have any existing items and must go to the network and fetch
        return false;
      }

      // If there are items then return them from cache
      if (items.length) {
        console.log(
          `There are ${items.length} items in the cache Gonna send them to apollo`
        );
        return items;
      }

      // First thing asks the read function for those items

      // We can either do one of two things

      // Return the items because they are already in the cache

      // Return False from here (network request)
    },

    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the Apollo client comes back from the network with our product

      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);

      // Return Items from the cacache
      return merged;
    },
  };
}
