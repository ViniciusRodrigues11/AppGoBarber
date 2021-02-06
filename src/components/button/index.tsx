import React from 'react'
import { RectButtonProperties } from "react-native-gesture-handler";
import { Container, ButtonText } from './styles'


interface ButtonPros extends RectButtonProperties {
  children: string;
  isCancelButton?: boolean;
}

const Button: React.FC<ButtonPros> = ({
  isCancelButton = false,
  children,
  ...rest
}) => {
  console.log('Button', isCancelButton);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Container isCancelButton={isCancelButton} {...rest}>
      <ButtonText isCancelButton={isCancelButton}>{children}</ButtonText>
    </Container>
  );
};


export default Button
