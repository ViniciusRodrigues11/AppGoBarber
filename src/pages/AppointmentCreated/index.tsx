import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather'
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText

} from './styles'
import { useNavigation, useRoute } from '@react-navigation/native';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {

  const { reset } = useNavigation()
  const { params } = useRoute()

  const routeParams = params as RouteParams;

  const formatedDate = useMemo(() => {
    return format(routeParams.date,
       "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
       {locale: ptBr})
  }, [routeParams.date])


  const handleOk = useCallback(() => {

    reset({
      routes: [
        {
          name: 'Dashboard'
        }
      ],
      index: 0
    })

  }, [reset]);


  return (
    <Container>

      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento Concluído</Title>
      <Description>{formatedDate}</Description>

      <OkButton onPress={handleOk}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  )
}
export default AppointmentCreated;
