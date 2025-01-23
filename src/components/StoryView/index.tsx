import React, {useEffect, useState} from 'react';
import {View, FlatList, Pressable, StyleSheet, Image} from 'react-native';
import {MultiStoryContainer} from 'react-native-story-view';
import {dp} from '@utils/dp.ts';
import {UserStoriesList} from '../../types/Stories.ts';
import {X} from 'react-native-feather';

interface StoryViewProps {
  stories: UserStoriesList;
}

const StoryView: React.FC<StoryViewProps> = ({stories}) => {
  const [isStoryViewVisible, setIsStoryViewVisible] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const openStories = (index: number) => {
    if (!loading) {
      setIsStoryViewVisible(true);
      setPressedIndex(index);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={stories}
        keyExtractor={item => item?.id?.toString()}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => openStories(index)}
            disabled={loading}
            style={{
              paddingBottom: dp(15),
              opacity: loading ? 0.5 : 1,
            }}>
            <Image
              source={{uri: item.icon}}
              style={{
                width: dp(85),
                height: dp(85),
                resizeMode: 'contain',
                marginRight: dp(15),
                opacity: loading ? 0.5 : 1,
              }}
            />
          </Pressable>
        )}
      />

      {isStoryViewVisible && (
        <MultiStoryContainer
          enableProgress={true}
          visible={isStoryViewVisible}
          viewedStories={[]}
          stories={stories}
          userStoryIndex={pressedIndex}
          onComplete={() => setIsStoryViewVisible(false)}
          renderHeaderComponent={() => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: dp(20),
                padding: dp(20),
              }}>
              <Pressable onPress={() => setIsStoryViewVisible(false)}>
                <X stroke={'white'} />
              </Pressable>
            </View>
          )}
          renderFooterComponent={() => <View></View>}
          storyContainerViewProps={{
            style: {
              width: '100%',
              height: '100%',
              padding: 0,
              margin: 0,
            },
          }}
          imageStyle={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export {StoryView};
