import { useState, useCallback } from 'react';
import { Form, FormLayout, Autocomplete, Button } from '@shopify/polaris';

export const AddForm = ({ updateStockData, autofillOptions }) => {
  const deselectedOptions = autofillOptions;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [enteredStock, setEnteredStock] = useState('');
  const [options, setOptions] = useState(deselectedOptions);
  const [renderedOptions, setRenderedOptions] = useState(options.slice(0, 100));
  const [inputError, setInputError] = useState(null);

  const updateText = useCallback(
    (value) => {
      setInputError(null);
      setEnteredStock(value);
      let firstHundredOptions;

      if (value === '') {
        firstHundredOptions = deselectedOptions.slice(0, 100);
        setOptions(deselectedOptions);
        setRenderedOptions(firstHundredOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) => option.label.match(filterRegex));
      firstHundredOptions = resultOptions.slice(0, 100);
      setOptions(resultOptions);
      setRenderedOptions(firstHundredOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.value;
      });

      setSelectedOptions(selected);
      setEnteredStock(selectedValue[0]);
      handleAddNewStock(selectedValue[0]);
    },
    [options]
  );

  const stockField = (
    <Autocomplete.TextField
      label="Company Name"
      type="text"
      value={enteredStock}
      onChange={updateText}
      placeholder="Enter the name of a public company (ex. Apple)"
      error={inputError ?? null}
    />
  );

  const loadMoreSuggestions = () => {
    const currentAmount = renderedOptions.length;
    setRenderedOptions(options.slice(0, currentAmount + 100));
  };

  const handleAddNewStock = (val) => {
    const symbolToAdd = val ?? enteredStock;
    const currentlyFollowed = JSON.parse(window.localStorage.getItem('followedSymbols')) || [];
    const alreadyFollowed = currentlyFollowed.find((obj) => obj.symbol == symbolToAdd);

    try {
      if (alreadyFollowed) {
        throw new Error(`You already follow ${symbolToAdd}`);
      } else {
        currentlyFollowed.unshift({
          symbol: symbolToAdd,
          type: 'stock',
        });
        window.localStorage.setItem('followedSymbols', JSON.stringify(currentlyFollowed));
        setEnteredStock(null);
        updateStockData();
      }
    } catch (e) {
      setInputError(e.message);
    }
  };

  return (
    <Form onSubmit={handleAddNewStock}>
      <FormLayout>
        <Autocomplete
          options={renderedOptions}
          selected={selectedOptions}
          onSelect={updateSelection}
          textField={stockField}
          willLoadMoreResults={true}
          onLoadMoreResults={loadMoreSuggestions}
        />
        <Button submit>Add</Button>
      </FormLayout>
    </Form>
  );
};
