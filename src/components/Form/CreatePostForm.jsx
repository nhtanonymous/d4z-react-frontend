import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import isEmpty from '../../helpers/isEmpty';
import InputForm from './InputForm';
import TextareaForm from './TextareaForm';
import RichTextEditorForm from './RichTextEditorForm';
import SelectInputForm from './SelectInputForm';
import { Container } from '../Styled/Wapper';
import { ButtonBtnType } from '../Styled/Button';
import {
	DivLg8Md10Center,
	DivFormGroup,
	DivCenter,
	FormTitleHeader,
	H1FormTileHeader,
	PFormTileHeader
} from '../Styled/LoginForm';

const propTypes = {
	createPostThunk: PropTypes.func.isRequired,
	fetchTagThunk: PropTypes.func.isRequired,
	fetchCategoryThunk: PropTypes.func.isRequired,
	fetchTagResetedThunk: PropTypes.func.isRequired,
	fetchCategoryResetedThunk: PropTypes.func.isRequired,
	createPost: PropTypes.object.isRequired,
	fetchTag: PropTypes.object.isRequired,
	fetchCategory: PropTypes.object.isRequired
};
const CreatePostForm = ({
	createPostThunk,
	fetchTagThunk,
	fetchCategoryThunk,
	fetchCategory,
	fetchTagResetedThunk,
	fetchCategoryResetedThunk,
	fetchTag,
	createPost
}) => {
	const history = useHistory();
	useEffect(() => {
		fetchTagThunk();
		fetchCategoryThunk();
		return () => {
			fetchTagResetedThunk();
			fetchCategoryResetedThunk();
		};
	}, [fetchCategoryResetedThunk, fetchCategoryThunk, fetchTagResetedThunk, fetchTagThunk]);
	const initialValues = {
		title: '',
		meta_title: '',
		meta_description: '',
		slug: '',
		summary: '',
		content: '',
		image: '',
		tag: [],
		category: []
	};
	const validationSchema = Yup.object({
		title: Yup.string()
			.min(6, 'Title must be at least 6 characters')
			.max(100, 'Title must be at most 100 characters')
			.required('Title is required'),
		meta_title: Yup.string()
			.min(6, 'Meta title must be at least 6 characters')
			.max(200, 'Meta title must be at most 200 characters')
			.required('Meta title is required'),
		meta_description: Yup.string()
			.min(6, 'Meta description must be at least 6 characters')
			.max(666, 'Meta description must be at most 666 characters')
			.required('Meta description is required'),
		slug: Yup.string()
			.min(6, 'Slug must be at least 6 characters')
			.max(100, 'Slug must be at most 100 characters')
			.required('Slug is required'),
		summary: Yup.string()
			.min(6, 'Summary must be at least 6 characters')
			.max(666, 'Summary must be at most 666 characters')
			.required('Summary is required'),
		content: Yup.string().required('Content is required'),
		image: Yup.string().required('Image is required'),
		tag: Yup.array()
			.min(1, 'Pick at least 1 tag')
			.of(
				Yup.object().shape({
					id: Yup.string().required(),
					title: Yup.string().required()
				})
			),
		category: Yup.array()
			.min(1, 'Pick at least 1 category')
			.of(
				Yup.object().shape({
					id: Yup.string().required(),
					title: Yup.string().required()
				})
			)
	});
	const onSubmit = (values) => {
		const post = {
			id: uuidv4(),
			title: values.title,
			meta_title: values.meta_title,
			meta_description: values.meta_description,
			slug: values.slug,
			summary: values.summary,
			image: values.image,
			content: values.content,
			tag: values.tag,
			category: values.category
		};
		console.log(post);
		Swal.fire({
			title: 'Do you want to create?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.isConfirmed) {
				createPostThunk(post, history);
			}
		});
	};
	return (
		<Container>
			<DivLg8Md10Center>
				<FormTitleHeader>
					<H1FormTileHeader>Create post</H1FormTileHeader>
					<PFormTileHeader>Create new post</PFormTileHeader>
				</FormTitleHeader>
				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
					{({ values, errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
						<form onSubmit={handleSubmit}>
							<DivFormGroup>
								<TextareaForm rows="3" label="Title" id="title" name="title" type="text" />
							</DivFormGroup>
							<DivFormGroup>
								<TextareaForm rows="3" label="Meta title" id="meta_title" name="meta_title" type="text" />
							</DivFormGroup>
							<DivFormGroup>
								<TextareaForm
									rows="6"
									label="Meta description"
									id="meta_description"
									name="meta_description"
									type="text"
								/>
							</DivFormGroup>
							<DivFormGroup>
								<InputForm label="Slug" id="slug" name="slug" type="text" />
							</DivFormGroup>
							<DivFormGroup>
								<TextareaForm rows="6" label="Summary" id="summary" name="summary" type="text" />
							</DivFormGroup>
							<DivFormGroup>
								<RichTextEditorForm
									label="Content"
									id="content"
									textareaName="content"
									onEditorChange={(selectedValue) => setFieldValue('content', selectedValue)}
									onBlur={() => setFieldTouched('content', true)}
									value={values.content}
									height="333"
									errors={errors.content}
									touched={touched.content}
								/>
							</DivFormGroup>
							<DivFormGroup>
								<SelectInputForm
									id="tag"
									name="tag"
									label="Tag"
									options={fetchTag.tag}
									onChange={(selectedValue) => {
										if (isEmpty(selectedValue)) {
											selectedValue = [];
										}
										setFieldValue('tag', selectedValue);
									}}
									onBlur={() => setFieldTouched('tag', true)}
									value={values.tag}
									getOptionValue={(option) => option.id}
									getOptionLabel={(option) => option.title}
									errors={errors.tag}
									touched={touched.tag}
								/>
							</DivFormGroup>
							<DivFormGroup>
								<SelectInputForm
									id="category"
									name="category"
									label="Category"
									options={fetchCategory.category}
									onChange={(selectedValue) => {
										if (isEmpty(selectedValue)) {
											selectedValue = [];
										}
										setFieldValue('category', selectedValue);
									}}
									onBlur={() => setFieldTouched('category', true)}
									value={values.category}
									getOptionValue={(option) => option.id}
									getOptionLabel={(option) => option.title}
									errors={errors.category}
									touched={touched.category}
								/>
							</DivFormGroup>
							<DivFormGroup>
								<InputForm label="Image" id="image" name="image" type="text" />
							</DivFormGroup>
							<DivCenter>
								{createPost.isLoading ? (
									<ButtonBtnType $typeBtn="primary" type="submit" disabled>
										Loading...
									</ButtonBtnType>
								) : (
									<ButtonBtnType $typeBtn="primary" type="submit">
										Create
									</ButtonBtnType>
								)}
							</DivCenter>
						</form>
					)}
				</Formik>
			</DivLg8Md10Center>
		</Container>
	);
};

CreatePostForm.propTypes = propTypes;

export default CreatePostForm;
