import {StyleSheet, Text, View} from 'react-native';
import {BLACK, BLUE, GREY, WHITE, YELLOW} from '@utils/colors.ts';
import {dp} from '@utils/dp.ts';
import {ArrowUpRight} from 'react-native-feather';
import React from 'react';
import { FormattedDate } from "react-intl";

type PromoCardProps = {
  title: string;
  headerText: string;
  bonus: string;
  date: Date;
  color?: 'blue' | 'grey' | 'yellow' | 'black';
};

const PromoCard: React.FC<PromoCardProps> = ({
  title,
  headerText,
  bonus,
  date,
  color = 'blue',
}) => {
  const getColor = () => {
    switch (color) {
      case 'blue':
        return BLUE;
      case 'grey':
        return GREY;
      case 'yellow':
        return YELLOW;
      default:
        return BLUE;
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: getColor(),
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: dp(10),
            fontWeight: '600',
            color: color === 'blue' ? WHITE : BLACK,
          }}>
          {headerText}
        </Text>
        <ArrowUpRight width={dp(20)} height={dp(20)} color={'black'} />
      </View>
      <View style={styles.content}>
        <Text
          style={{
            color: color === 'blue' ? WHITE : BLACK,
            fontSize: dp(18),
            fontWeight: '600',
          }}>
          {title}
        </Text>
      </View>
      <View style={styles.footer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.date}>
            <Text style={{fontWeight: '500', fontSize: dp(11)}}>👉до <FormattedDate value={date} year="numeric" month="long" day="numeric" /></Text>
          </View>
          <Text
            style={{
              color: color === 'blue' ? WHITE : BLACK,
              fontSize: dp(36),
              fontWeight: '600',
            }}>
            {bonus}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: dp(25),
    marginTop: dp(16),
    padding: dp(16),
    minHeight: dp(120),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    alignSelf: 'center',
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderRadius: dp(32),
    height: dp(22),
    flexDirection: 'row',
    paddingLeft: dp(10),
    paddingRight: dp(10),
    paddingTop: dp(3),
    paddingBottom: dp(3),
  },
});

export {PromoCard};
