import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'
import { useAuth } from '../../hooks/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePicker,
  OpenDatePickerText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText
} from './styles';
import api from '../../services/api';
import { Platform, Alert } from 'react-native';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}


const CreateAppointment: React.FC = () => {


  const route = useRoute();
  const { providerId } = route.params as RouteParams;
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation()

  const [availability, setAvailability] = useState<AvailabilityItem[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(providerId)

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  useEffect(() => {

    api.get('providers').then(response => {
      setProviders(response.data)
    })

  }, [])

  useEffect(() => {

    api.get(`/providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()

      }
    }).then(response => {
      setAvailability(response.data)
    })

  }, [selectedDate, selectedProvider])

  const handleToggleDatePicker = useCallback(() => {

    setShowDatePicker(state => !state)

  }, [])

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {

    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }

    if (date) {
      setSelectedDate(date)
    }


  }, [])

  const HandleSelectProvider = useCallback((id: string) => {

    setSelectedProvider(id)
    setSelectedHour(0)

  }, [])

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const HandleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)

      date.setHours(selectedHour)
      date.setMinutes(0)

      await api.post('appointments', {
        provider_id: selectedProvider,
        date
      })

      navigate('AppointmentCreated', { date: date.getTime() })


    } catch (err) {
      Alert.alert('Erro ao criar agendamento',
      'Ocorreu um erro ao criar o agendamento, por favor tente novamente')
    }

  }, [selectedDate, navigate, selectedHour, selectedProvider])

  const morningAvailability = useMemo(() => {
    return availability.filter(({ hour }) => hour < 12).map(({ hour, available }) => {
      return {
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00')
      }
    })

  }, [availability])

  const afternoonAvailability = useMemo(() => {
    return availability.filter(({ hour }) => hour >= 12).map(({ hour, available }) => {
      return {
        hour,
        available,
        hourFormatted: format(new Date().setHours(hour), 'HH:00')
      }
    })

  }, [availability])


  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>
          Cabeleireiros
        </HeaderTitle>

        <UserAvatar source={user.avatar_url ? { uri: user.avatar_url } : { uri: 'https://image.flaticon.com/icons/png/512/145/145843.png' }} />

      </Header>
      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer onPress={() => HandleSelectProvider(provider.id)} selected={provider.id === selectedProvider}>
              <ProviderAvatar source={provider.avatar_url ? { uri: provider.avatar_url } : { uri: 'https://image.flaticon.com/icons/png/512/145/145843.png' }} />
              <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
            </ProviderContainer>
          )}
        >
        </ProvidersList>
      </ProvidersListContainer>

      <Calendar>
        <Title>Escolha a data</Title>

        <OpenDatePicker onPress={handleToggleDatePicker}>
          <OpenDatePickerText>Selecionar outra data</OpenDatePickerText>
        </OpenDatePicker>

        {showDatePicker && (
          <DateTimePicker

            onChange={handleDateChange}
            mode="date"
            display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
            value={selectedDate}
            {...(Platform.OS === 'ios' && { textColor: '#f4ede8' })}
          />
        )}

      </Calendar>


      <Schedule>
        <Title>Escolha o horário</Title>

        <Section>
          <SectionTitle>Manhã</SectionTitle>

          <SectionContent>
            {morningAvailability.map(({ hourFormatted, available, hour }) => (
              <Hour enabled={available} selected={selectedHour == hour} onPress={() => handleSelectHour(hour)} available={available} key={hourFormatted}>
                <HourText selected={selectedHour == hour}>{hourFormatted}</HourText>
              </Hour>
            ))}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Tarde</SectionTitle>

          <SectionContent>
            {afternoonAvailability.map(({ hourFormatted, available, hour }) => (
              <Hour enabled={available} selected={selectedHour == hour} onPress={() => handleSelectHour(hour)} available={available} key={hourFormatted}>
                <HourText selected={selectedHour == hour}>{hourFormatted}</HourText>
              </Hour>
            ))}
          </SectionContent>
        </Section>
      </Schedule>

      <CreateAppointmentButton onPress={HandleCreateAppointment}>
        <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
      </CreateAppointmentButton>


    </Container>
  )
}
export default CreateAppointment;
