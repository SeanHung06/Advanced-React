/* eslint-disable react/jsx-props-no-spreading */
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { DropDown, SearchStyles, DropDownItem } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();
  const [findItems, { loading, data, error }] = useLazyQuery(
    // use lazyQuery to use the cache result first and if there are changes return from API and will update it afterwards
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const items = data?.searchTerms || [];
  const findItemsButChill = debounce(findItems, 350); // Debounce to avoid DDOS issue if as it will fire off the search once we type everywords
  resetIdCounter();
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      console.log('Input Changed');
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    // Use router to create the pathway to the selected items page
    onSelectedItemChange({ selectedItem }) {
      router.push({ pathname: `/product/${selectedItem.id}` });
    },
    itemToString: (item) => item?.name || '', // Avoid the select abr object.object message cause from itemToString in JS
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>

      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              key={item.id}
              {...getItemProps({ item, index })} // TO make the highlight function work as changing the aria-select to true while mouse click
              highlighted={index === highlightedIndex} // Hightlight the Selected Items
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem> Sorry, No items found for {inputValue} </DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
