import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { API_URL, MEDIA_URL } from '../../config';

const ProjectSection = styled.section`
	padding: 2rem 0;
`;

const Form = styled.form`
	background: rgba(255, 255, 255, 0.02);
	padding: 2rem;
	border-radius: 15px;
	border: 1px solid rgba(212, 175, 55, 0.1);
	margin-bottom: 2rem;
`;

const FormGroup = styled.div`
	margin-bottom: 1.5rem;
`;

const Label = styled.label`
	display: block;
	color: ${props => props.theme.colors.text};
	margin-bottom: 0.5rem;
`;

const Input = styled.input`
	width: 100%;
	padding: 0.8rem;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(212, 175, 55, 0.2);
	border-radius: 5px;
	color: ${props => props.theme.colors.text};
	margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
	width: 100%;
	padding: 0.8rem;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(212, 175, 55, 0.2);
	border-radius: 5px;
	color: ${props => props.theme.colors.text};
	min-height: 100px;
`;

const Select = styled.select`
	width: 100%;
	padding: 0.8rem;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(212, 175, 55, 0.2);
	border-radius: 5px;
	color: ${props => props.theme.colors.text};
`;

const Button = styled.button`
	background: ${props => props.theme.colors.primary};
	color: ${props => props.theme.colors.background};
	padding: 0.8rem 1.5rem;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: 600;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
	}
`;

const ProjectList = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 2rem;
	margin-top: 2rem;
`;

const ProjectCard = styled.div`
	background: rgba(255, 255, 255, 0.02);
	border-radius: 10px;
	border: 1px solid rgba(212, 175, 55, 0.1);
	overflow: hidden;
`;

const ProjectMedia = styled.div`
	position: relative;
	aspect-ratio: 16/9;
	background: #000;
`;

const ProjectImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const ProjectInfo = styled.div`
	padding: 1rem;
`;

const DeleteButton = styled.button`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background: rgba(244, 67, 54, 0.8);
	color: white;
	border: none;
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;

	&:hover {
		background: #f44336;
		transform: scale(1.1);
	}
`;

function ProjectManagement() {
	const [projects, setProjects] = useState([]);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: 'image',
		mediaUrl: '',
		mediaFile: null
	});

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		try {
			const response = await fetch(`${API_URL}/api/admin/projects`);
			const data = await response.json();
			setProjects(data);
		} catch (error) {
			console.error('Erreur lors de la récupération des projets:', error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'mediaFile' && files) {
			setFormData(prev => ({ ...prev, mediaFile: files[0] }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formDataToSend = new FormData();
		
		formDataToSend.append('title', formData.title);
		formDataToSend.append('description', formData.description);
		formDataToSend.append('category', formData.category);
		
		if (formData.category === 'url') {
			formDataToSend.append('mediaUrl', formData.mediaUrl);
		} else {
			if (!formData.mediaFile) {
				alert('Veuillez sélectionner un fichier');
				return;
			}
			formDataToSend.append('media', formData.mediaFile);
		}

		try {
			const response = await fetch(`${API_URL}/api/admin/projects`, {
				method: 'POST',
				body: formDataToSend
			});

			if (!response.ok) throw new Error('Erreur lors de l\'ajout du projet');

			setFormData({
				title: '',
				description: '',
				category: 'image',
				mediaUrl: '',
				mediaFile: null
			});

			// Reset file input
			const fileInput = document.querySelector('input[type="file"]');
			if (fileInput) fileInput.value = '';

			fetchProjects();
		} catch (error) {
			console.error('Erreur:', error);
			alert('Erreur lors de l\'ajout du projet: ' + error.message);
		}
	};

	const getMediaUrl = (project) => {
		if (project.category === 'url') {
			return project.mediaUrl;
		}
		if (project.mediaUrl.startsWith('http')) {
			return project.mediaUrl;
		}
		return `${MEDIA_URL}${project.mediaUrl}`;
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

		try {
			const response = await fetch(`${API_URL}/api/admin/projects/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) throw new Error('Erreur lors de la suppression');

			fetchProjects();
		} catch (error) {
			console.error('Erreur:', error);
		}
	};

	return (
		<ProjectSection>
			<Form onSubmit={handleSubmit}>
				<FormGroup>
					<Label>Titre</Label>
					<Input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						required
					/>
				</FormGroup>

				<FormGroup>
					<Label>Description</Label>
					<TextArea
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						required
					/>
				</FormGroup>

				<FormGroup>
					<Label>Type de média</Label>
					<Select
						name="category"
						value={formData.category}
						onChange={handleInputChange}
					>
						<option value="image">Image de l'ordinateur</option>
						<option value="video">Vidéo de l'ordinateur</option>
						<option value="url">URL en ligne</option>
					</Select>
				</FormGroup>

				{formData.category === 'url' ? (
					<FormGroup>
						<Label>URL du média (image ou vidéo en ligne)</Label>
						<Input
							type="url"
							name="mediaUrl"
							value={formData.mediaUrl}
							onChange={handleInputChange}
							placeholder="https://exemple.com/image.jpg"
							required={formData.category === 'url'}
						/>
					</FormGroup>
				) : (
					<FormGroup>
						<Label>Fichier {formData.category === 'image' ? 'image' : 'vidéo'} de l'ordinateur</Label>
						<Input
							type="file"
							name="mediaFile"
							accept={formData.category === 'image' ? 'image/*' : 'video/*'}
							onChange={handleInputChange}
							required={formData.category !== 'url'}
						/>
					</FormGroup>
				)}

				<Button type="submit">
					<FontAwesomeIcon icon={faPlus} /> Ajouter le projet
				</Button>
			</Form>

			<ProjectList>
				{projects.map(project => (
					<ProjectCard key={project._id}>
						<ProjectMedia>
							{project.category === 'video' ? (
								<video
									src={getMediaUrl(project)}
									controls
									style={{ width: '100%', height: '100%' }}
								/>
							) : (
								<ProjectImage src={getMediaUrl(project)} alt={project.title} />
							)}
							<DeleteButton onClick={() => handleDelete(project._id)}>
								<FontAwesomeIcon icon={faTrash} />
							</DeleteButton>
						</ProjectMedia>
						<ProjectInfo>
							<h3>{project.title}</h3>
							<p>{project.description}</p>
						</ProjectInfo>
					</ProjectCard>
				))}
			</ProjectList>
		</ProjectSection>
	);
}

export default ProjectManagement;