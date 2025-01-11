import React, {useEffect, useState} from 'react';
import {View, FlatList, Pressable, StyleSheet, Image, Text} from 'react-native';
import {MultiStoryContainer} from 'react-native-story-view'; // Assuming you're using this library
import {dp} from '@utils/dp.ts';
import {UserStoriesList} from '../../types/Stories.ts';
import {X} from 'react-native-feather'; //

interface StoryViewProps {
  stories: UserStoriesList; // Replace `any` with the proper type for your stories/ Optional footer component
}

const StoryView: React.FC<StoryViewProps> = ({stories}) => {
  const [isStoryViewVisible, setIsStoryViewVisible] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number>(0);

  const openStories = (index: number) => {
    setIsStoryViewVisible(true);
    setPressedIndex(index);
  };




  return (
    <View style={styles.container}>
      {/* Story Avatars */}
      <FlatList
        horizontal
        data={stories}
        keyExtractor={item => item?.id?.toString()}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => openStories(index)}
            style={{
              paddingBottom: dp(15),
            }}>
            <Image
              source={{uri: item.icon}}
              style={{
                width: dp(85),
                height: dp(85),
                resizeMode: 'contain',
                marginRight: dp(15),
              }}
            />
          </Pressable>
        )}
      />

      {/* Story Viewer */}
      {isStoryViewVisible && (
        <MultiStoryContainer
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
