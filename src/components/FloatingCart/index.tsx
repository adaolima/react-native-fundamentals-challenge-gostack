import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const total: number[] = [];
    products.map(product => total.push(product.price * product.quantity));
    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;
    const totalPrice = total.reduce(reducer, 0);
    return formatValue(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const total: number[] = [];
    products.map(product => total.push(product.quantity));
    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;
    const quantity = total.reduce(reducer, 0);

    return quantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
