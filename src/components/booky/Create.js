import React, {useState} from 'react';
import { Button, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";
import { useMutation, gql } from "@apollo/client";

const CREATE_BOOK_MUTATION = gql`
	mutation createBook(
		$name: String!
		$description: String!
	) {
		createBook(createBookInput: { name: $name, description: $description }) {
			id 
			name 
			description
		}
	}
`;

const CreateBookComponent = () => { 
	const [inputs, setInputs] = useState({});

	const [formState, setFormState] = useState({
		name: '',
		description: ''
	});

	const [createBook, {data, loading, error, reset}] = useMutation(CREATE_BOOK_MUTATION, {
		refetchQueries: ['BOOKS_QUERY'],
	});

	
	const handleChange = (event) => {
		const { name, value } = event.target;
    	setFormState((prev) => ({ ...prev, [name]: value }));
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await createBook({
				variables: { name: formState.name, description: formState.description }
			});
		} catch (err) { 
			console.error("Error creating book:", err);
		}
	};

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
												value={formState.name} 
												onChange={handleChange} 
											/>
										</Field.Root>
										<Field.Root >
											<Field.Label>Description</Field.Label>
											<Input 
												type='text'
												name="description"
												placeholder='Enter book description'
												value={formState.description} 
												onChange={handleChange}
											/>
										</Field.Root>
										<Button type="submit" isLoading={loading}>Submit</Button>
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