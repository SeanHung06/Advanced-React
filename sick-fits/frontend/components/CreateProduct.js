import useForm from '../lib/useForm';
import Form from './styles/Form';

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: 'Nice Shoes',
    price: '544',
    description: 'These are the Best Shoes',
  });
  return (
    <Form
      onsubmit={(e) => {
        e.preventDefault();
        console.log(inputs);
      }}
    >
      <fieldset ania-busy>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            placeholder="Upload an Image!"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="text"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit" onClick={clearForm}>
          +Add Product
        </button>
      </fieldset>
    </Form>
  );
}
