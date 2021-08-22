import { useRef } from 'react';
import * as React from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Block, Photo } from '../../elements';
import PokemonAbility from '../../services/pokemon-ability';
import { Result } from '../../services/pokemons';
import PokemonDetail from '../../services/pokemon';

const { width, height } = Dimensions.get('screen');

interface Props {
  pokemonsList: Array<PokemonProps>;
  checkScroll: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined;
  onEndReached: () => {};
}

export interface PokemonProps extends Result {
  image: string;
  image_url: string;
  detail: PokemonDetail;
  abilities: Array<PokemonAbility>;
}

const PokemonList: React.FC<Props> = ({ pokemonsList, checkScroll, onEndReached }) => {
  const flatListRef = useRef<FlatList<any>>(null);

  return (
    <Block z={11} absolute width={width} height={height}>
      <FlatList
        testID="flat-list"
        ref={flatListRef}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        data={pokemonsList}
        keyExtractor={(item: PokemonProps) => `${item.detail.id}`}
        renderItem={({ item, index }) => (
          <Block key={index} width={width} middle center>
            <Photo
              source={item.image || item.image_url}
              resizeMode="contain"
              style={{ minWidth: (width * height) / (width * 3), flex: 1 }}
            />
          </Block>
        )}
        onScroll={checkScroll}
        onEndReachedThreshold={4}
        onEndReached={onEndReached}
        extraData={pokemonsList}
      />
    </Block>
  );
};

export default PokemonList;
