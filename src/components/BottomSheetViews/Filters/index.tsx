import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CheckBox} from '@styled/buttons/CheckBox';
import {dp} from '../../../utils/dp';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {Button} from '@styled/buttons';
import {useBusiness} from '../../../api/hooks/useAppContent';
import {useAppState} from '@context/AppContext';
import {FiltersType} from '../../../types/models/FiltersType';
import {cloneDeep} from 'lodash';
import { filters } from "css-select";

// Define types
type Filter = {
  code: string;
  name: string;
};

type Section = {
  id: number;
  name: string;
  code: string;
};

type FilterItem = {
  sectionCode: string;
  filter: Filter;
};

type SelectedFilters = {
  [sectionCode: string]: string[];
};

const data: {title: Section; data: Filter[]}[] = [
  {
    title: {id: 1, name: 'Услуги', code: 'tags'},
    data: [
      {code: 'vac', name: 'Пылесос'},
      {code: 'air', name: 'Воздух'},
      {code: 'handwash', name: 'Рукомойник'},
      {code: 'dryer', name: 'Сушка'},
      {code: 'toilet', name: 'Туалет'},
      {code: 'dryingarea', name: 'Зона протирки'},
    ],
  },
  {
    title: {id: 2, name: 'Сеть', code: 'brand'},
    data: [{code: 'DS', name: 'Мой-Ка!DS'}],
  },
  {
    title: {id: 3, name: 'Тип', code: 'type'},
    data: [
      {code: 'SelfService', name: 'Самообслуживание'},
      {code: 'Portal', name: 'Робот'},
    ],
  },
];
const generateQuery = (selectedFilters: SelectedFilters): string => {
  const queryFilters: string[] = [];
  Object.entries(selectedFilters).forEach(([sectionCode, filters]) => {
    filters.forEach(filter => {
      if (filter === 'Самообслуживание') {
        queryFilters.push(`${sectionCode}:SelfService`);
      } else if (filter === 'Робот') {
        queryFilters.push(`${sectionCode}:Portal`);
      } else {
        queryFilters.push(`${sectionCode}:${filter}`);
      }
    });
  });
  return queryFilters.join(',');
};

const Filters = () => {
  //Global state
  const {state, setState} = useAppState();
  const fitlers = state.filters;
  const navigation: any = useNavigation();

  //Local filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    cloneDeep(fitlers),
  );
  const query = generateQuery(selectedFilters);

  // Function to handle filter selection
  const toggleFilter = (sectionCode: string, filterCode: string) => {
    setSelectedFilters(prevSelectedFilters => {
      const updatedFilters = cloneDeep(prevSelectedFilters);
      if (!updatedFilters[sectionCode]) {
        updatedFilters[sectionCode] = [];
      }
      const index = updatedFilters[sectionCode].indexOf(filterCode);
      if (index === -1) {
        updatedFilters[sectionCode].push(filterCode); // Select filter
      } else {
        updatedFilters[sectionCode].splice(index, 1); // Deselect filter
      }
      return updatedFilters;
    });
  };

  const [columns, setColumns] = useState(3);
  //Query
  const {
    isFetching,
    refetch,
  } = useBusiness({filter: query}, false);


  // Function to handle submit button press
  const handleSubmit = async () => {
    // Clear selected filters state if needed
    //setSubmit(true);
    refetch().then(data => {
      if (data.isSuccess && data.data) {
        setState({
          ...state,
          businesses: data.data.businessesLocations,
          filters: cloneDeep(selectedFilters),
        });
        navigation.navigate('Main');
      }
    });
  };

  const renderFilterItem = ({item}: {item: FilterItem}) => {
    const {sectionCode, filter} = item;

    const isSelected = selectedFilters[sectionCode]?.includes(filter.name);

    return (
      <TouchableOpacity
        onPress={() => toggleFilter(sectionCode, filter.name)}
        style={{marginRight: dp(10)}}>
        <View
          style={[
            styles.chip,
            {
              backgroundColor: isSelected ? '#BFFA00' : '#F5F5F5',
            },
          ]}>
          <Text style={styles.chipText}>{filter.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = ({item}: {item: {title: Section; data: Filter[]}}) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{item.title.name}</Text>
        <FlatList
          data={item.data.map((filter: Filter) => ({
            sectionCode: item.title.code,
            filter,
          }))}
          renderItem={renderFilterItem}
          numColumns={columns}
          keyExtractor={filterItem => filterItem.filter.code}
          columnWrapperStyle={{
            paddingTop: dp(10),
            justifyContent: 'flex-start',
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderSection}
        keyExtractor={section => section.title.code}
        contentContainerStyle={{
          marginTop: dp(20),
          flex: 1,
          marginBottom: dp(60),
        }}
        ListFooterComponentStyle={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        ListFooterComponent={
          <Button
            label={'Применить'}
            color={'blue'}
            width={dp(172)}
            height={dp(43)}
            fontSize={dp(16)}
            fontWeight={'600'}
            onClick={handleSubmit}
            showLoading={isFetching}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: dp(15),
    paddingLeft: dp(22),
    paddingRight: dp(22),
    borderRadius: dp(38),
  },
  header: {
    alignItems: 'center',
  },
  list: {
    paddingLeft: dp(22),
  },
  headerTxt: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: '#000',
    fontSize: dp(24),
    fontWeight: '600',
  },
  footer: {
    flex: 1,
    marginVertical: dp(100),
    alignItems: 'center',
  },
  chip: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingRight: dp(10),
    paddingLeft: dp(10),
    height: dp(24),
    minWidth: dp(94),
    borderRadius: dp(69),
  },
  chipText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: dp(12),
    fontWeight: '600',
  },
  section: {
    marginTop: dp(25),
  },
});

export {Filters};
