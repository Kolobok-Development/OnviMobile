import React, {useEffect, useState} from 'react';
import {View, FlatList, Pressable, StyleSheet, Image, Text} from 'react-native';
import {MultiStoryContainer} from 'react-native-story-view'; // Assuming you're using this library
import {dp} from '@utils/dp.ts';
import {UserStoriesList} from '../../types/Stories.ts';
import {X} from 'react-native-feather'; // Assuming this is the close icon you're using

interface StoryViewProps {
  stories: UserStoriesList; // Replace `any` with the proper type for your stories
}

const StoryView: React.FC<StoryViewProps> = ({stories}) => {
  const [isStoryViewVisible, setIsStoryViewVisible] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true); // State to track loading

  const openStories = (index: number) => {
    if (!loading) {
      // Prevent opening stories if loading
      setIsStoryViewVisible(true);
      setPressedIndex(index);
    }
  };

  // Simulate loading delay on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after a delay
    }, 1000); // Set loading duration (3 seconds in this case)

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

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
            disabled={loading} // Disable interaction while loading
            style={{
              paddingBottom: dp(15),
              opacity: loading ? 0.5 : 1, // Grey out while loading
            }}>
            <Image
              source={{uri: item.icon}}
              style={{
                width: dp(85),
                height: dp(85),
                resizeMode: 'contain',
                marginRight: dp(15),
                opacity: loading ? 0.5 : 1, // Apply grey-out effect
              }}
            />
          </Pressable>
        )}
      />

      {/* Story Viewer */}
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
