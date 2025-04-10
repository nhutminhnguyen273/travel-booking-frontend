import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { Tour, TourType, StatusTour, Schedule } from '../../types/tour';
import type { ItineraryDay } from '../../types/tour';
import type { CreateTourData } from '../../types/tour';
import tourService from '../../services/tourService';
import ErrorBoundary from '../../components/ErrorBoundary';
import authService from '../../services/authService';

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Heading = styled.h1`
  font-size: ${props => props.theme.fontSizes.xl};
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.base};
  max-width: 800px;
  margin: 0 auto;
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: white;
  font-size: ${props => props.theme.fontSizes.base};
  width: 100%;
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  min-height: 100px;
  background-color: white;
  font-size: ${props => props.theme.fontSizes.base};
  width: 100%;
  resize: vertical;
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: white;
  font-size: ${props => props.theme.fontSizes.base};
  width: 100%;
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.base};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 600;
  font-size: ${props => props.theme.fontSizes.base};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ArrayInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const ArrayInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const RemoveButton = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const AddButton = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.success};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  align-self: flex-start;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const ItineraryDay = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: ${props => props.theme.spacing.base};
  border: 1px solid ${props => props.theme.colors.border};
`;

const DayTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.base};
  padding: ${props => props.theme.spacing.base};
  background-color: ${props => props.theme.colors.error}10;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.base};
`;

const EditTourContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Tour>({
    _id: '',
    title: '',
    description: '',
    price: 0,
    destination: [],
    type: TourType.DOMESTIC,
    duration: 0,
    schedules: [],
    maxPeople: 0,
    remainingSeats: 0,
    images: [],
    itinerary: [],
    status: StatusTour.Available,
    isDeleted: false
  });

  useEffect(() => {
    // Check authentication when component mounts
    const token = authService.getToken();
    const user = authService.getUser();
    console.log('=== Authentication Debug ===');
    console.log('Token:', token);
    console.log('User from localStorage:', user);
    console.log('User Role:', user?.role);
    console.log('Is Admin:', user?.role === 'admin');
    console.log('===========================');

    if (!token || !user || user.role !== 'admin') {
      setError('You need to be logged in as an admin to access this page');
      return;
    }

    // Fetch tour data if we have an ID
    if (id) {
      fetchTourData();
    }
  }, [id]);

  const fetchTourData = async () => {
    try {
      setIsLoading(true);
      const tour = await tourService.getTourById(id!);
      console.log('Fetched tour data:', tour);
      setFormData(tour);
    } catch (error: any) {
      console.error('Error fetching tour:', error);
      setError(error.message || 'Failed to fetch tour data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleArrayChange = (field: keyof Tour, index: number, value: string) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as any[])];
      newArray[index] = value;
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleAddArrayItem = (field: keyof Tour) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as any[]), '']
      }));
    }
  };

  const handleRemoveArrayItem = (field: keyof Tour, index: number) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...(formData[field] as any[])];
      newArray.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleAddItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: '', description: '' }
      ]
    }));
  };

  const handleItineraryChange = (index: number, field: keyof ItineraryDay, value: string | number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      itinerary: newItinerary
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('Tour ID is missing');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const tourData: Partial<Tour> = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        destination: formData.destination,
        type: formData.type,
        duration: formData.duration,
        schedules: formData.schedules,
        maxPeople: formData.maxPeople,
        remainingSeats: formData.remainingSeats,
        images: formData.images,
        itinerary: formData.itinerary,
        status: formData.status,
        isDeleted: formData.isDeleted
      };

      console.log('Updating tour with data:', tourData);
      const response = await tourService.updateTour(id, tourData);
      console.log('Update response:', response);
      
      toast.success('Tour updated successfully');
      navigate('/admin/tours');
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour');
      setError('Failed to update tour. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Heading>Loading tour data...</Heading>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <Heading>Error: {error}</Heading>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Heading>Edit Tour</Heading>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Price</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleNumberChange}
            min="0"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Destination</Label>
          <ArrayInputContainer>
            {formData.destination.map((dest, index) => (
              <ArrayInput key={index}>
                <Input
                  type="text"
                  value={dest}
                  onChange={(e) => handleArrayChange('destination', index, e.target.value)}
                  placeholder="Enter destination"
                />
                <RemoveButton type="button" onClick={() => handleRemoveArrayItem('destination', index)}>
                  Remove
                </RemoveButton>
              </ArrayInput>
            ))}
            <AddButton type="button" onClick={() => handleAddArrayItem('destination')}>
              Add Destination
            </AddButton>
          </ArrayInputContainer>
        </FormGroup>

        <FormGroup>
          <Label>Type</Label>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value={TourType.DOMESTIC}>Domestic</option>
            <option value={TourType.INTERNATIONAL}>International</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Duration (days)</Label>
          <Input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleNumberChange}
            min="1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Max People</Label>
          <Input
            type="number"
            name="maxPeople"
            value={formData.maxPeople}
            onChange={handleNumberChange}
            min="1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Remaining Seats</Label>
          <Input
            type="number"
            name="remainingSeats"
            value={formData.remainingSeats}
            onChange={handleNumberChange}
            min="0"
            max={formData.maxPeople}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value={StatusTour.Available}>Available</option>
            <option value={StatusTour.Unavailable}>Unavailable</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Itinerary</Label>
          <ArrayInputContainer>
            {formData.itinerary.map((day, index) => (
              <ItineraryDay key={index}>
                <DayTitle>Day {day.day}</DayTitle>
                <Input
                  type="text"
                  value={day.title}
                  onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                  placeholder="Day title"
                  style={{ marginBottom: '0.5rem' }}
                />
                <TextArea
                  value={day.description}
                  onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                  placeholder="Day description"
                />
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveArrayItem('itinerary', index)}
                  style={{ marginTop: '0.5rem' }}
                >
                  Remove Day
                </RemoveButton>
              </ItineraryDay>
            ))}
            <AddButton type="button" onClick={handleAddItineraryDay}>
              Add Day
            </AddButton>
          </ArrayInputContainer>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Tour'}
        </Button>
      </Form>
    </Wrapper>
  );
};

const EditTour: React.FC = () => {
  return (
    <ErrorBoundary>
      <EditTourContent />
    </ErrorBoundary>
  );
};

export default EditTour;
