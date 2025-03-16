import React, {useState} from 'react';
import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";
import { useMutation, gql, useApolloClient } from "@apollo/client";

const CREATE_BOOK_MUTATION = gql`
	mutation createBook($createBookInput: CreateBookInput) {
		createBook(createBookInput: $createBookInput) {
			id 
			name 
			description
		}
	}
`;

const BOOKS_QUERY = gql`
  {books {id name description }}
`;

const CreateBookComponent = () => { 
	const [inputs, setInputs] = useState({});
  	const client = useApolloClient();

	const [createBook] = useMutation(CREATE_BOOK_MUTATION, {
    update(cache, { data: { createBook } }) {
      try {
        const existingBooks = cache.readQuery({ query: BOOKS_QUERY });
        if (existingBooks) {
          cache.writeQuery({
            query: BOOKS_QUERY,
            data: { books: [...existingBooks.books, createBook] },
          });
        }
      } catch (err) {
        console.error("Error updating cache:", err);
      }
    },
  });
	
	// Detects form inputs values change 
	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInputs(values => ({...values, [name]: value}));
	}
	// Handles form submit event
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await createBook({
				variables: {
				  createBookInput: {
					name: inputs.name,
					description: inputs.description
				  }
				},
				onCompleted: () => {
					alert('Success')
				},
				onError: (err) => {
					alert(err.message);
				}
			});
      await client.refetchQueries({ include: ["BOOKS_QUERY"] });
		} catch (err) { 
			console.error("Error creating book:", err);
		}
	};
	// Handle reset form event
	const handleReset = () => {
		setInputs({name: '', description: ''});
	}
	
	return(
		<>
			<Dialog.Root colorPaltte='green' >
				<Dialog.Trigger asChild>
					<Button variant="outline" colorPalette="green" >
					<RiAddFill /> Create new book
					</Button>
				</Dialog.Trigger>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Create a new book</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body pb="4">
								<form onSubmit={handleSubmit}>
									<Stack gap="4">
										<Field.Root>
											<Field.Label>Book Name</Field.Label>
											<Input 
												type='text'
												name="name"
												placeholder='Enter book name'
												value={inputs.name || ''} 
												onChange={handleChange} 
											/>
										</Field.Root>
										<Field.Root >
											<Field.Label>Description</Field.Label>
											<Input 
												type='text'
												name="description"
												placeholder='Enter book description'
												value={inputs.description || ''} 
												onChange={handleChange}
											/>
										</Field.Root>
										<Button type="submit" >Submit</Button>
										<Button type='reset' onClick={ handleReset }>Reset</Button>
                   
									</Stack>
								</form>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button variant="outline" >Close</Button>
								</Dialog.ActionTrigger>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</>
	);
}

export default CreateBookComponent;