import React, {useEffect, useState} from 'react';
import {FlatList, SectionList, StyleSheet, Text, View} from 'react-native';
import {CheckBox} from "@styled/buttons/CheckBox";
import {dp} from "../../../utils/dp";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {BackButton} from "@components/BackButton";
import {useNavigation, useRoute} from '@react-navigation/native'
import {Button} from "@styled/buttons";
import {useBusiness} from "../../../api/hooks/useAppContent";
import { useUpdate, useStateSelector } from '@context/AppContext';
import { useAppState } from '@context/AppContext';
import {FiltersType} from "../../../types/models/FiltersType";

const data = [
    {
        title: { id: 1, name: 'Услуги', code: 'tags' },
        data: [
            { code: 'vac', name: 'Пылесос' },
            { code: 'air', name: 'Воздух' },
            { code: 'handwash', name: 'Рукомойник' },
            { code: 'dryer', name: 'Сушка' },
            { code: 'toilet', name: 'Туалет' },
            { code: 'dryingarea', name: 'Зона протирки' },
        ],
    },
    {
        title: { id: 2, name: 'Сеть', code: 'brand' },
        data: [
            { code: 'DS', name: 'Мой-Ка!DS' },
        ],
    },
    {
        title: { id: 3, name: 'Тип', code: 'type' },
        data: [
            { code: 'SelfService', name: 'Самообслуживание' },
            { code: 'Portal', name: 'Робот' },
        ],
    },
];

interface CheckBoxItemProps {
    code: string;
    checked: boolean;
    name: string;
    sectionName: string;
    onCheckBoxClick: (sectionName: string, checkBoxCode: string, checkboxValue: string) => void;
}

// Define a type for the object that will store checkbox values


const CheckBoxItem: React.FC<CheckBoxItemProps> = ({ code, name, sectionName, onCheckBoxClick, checked  }) => {
    const [isChecked, setIsChecked] = React.useState(checked);

    const handleCheckBoxClick = () => {
        setIsChecked((prevChecked) => !prevChecked);
        const checkboxValue = !isChecked ? name : ''; // Set checkbox value based on checked state
        onCheckBoxClick(sectionName, code, checkboxValue);
    };

    return (
        <View style={{ paddingRight: dp(6), paddingBottom: dp(6)}}>
            <CheckBox
                width={dp(94)}
                height={dp(24)}
                borderRadius={dp(69)}
                backgroundColor={'#F5F5F5'}
                checked={checked}
                text={name}
                textColor={'#000000'}
                fontSize={dp(12)}
                fontWeight={'600'}
                onClick={handleCheckBoxClick}
            />
        </View>
    );
};


const Filters = () => {
    const filters: FiltersType = useStateSelector((state: any) => state.filters);
    const [selectedFilters, setSelectedFilters] = useState<FiltersType>(filters);
    const [query, setQuery] = useState("");

    const [filtersApplied, setFiltersApplied] = useState(false);
    
    const navigation: any = useNavigation()
    const { state, setState } = useAppState()


    // React query
    const {
        isFetching,
        data: businessData,
        refetch: getBusinesses,
    } = useBusiness({filter: query}, false);

    const getCheckedState = (sectionName: string, code: string) => {
        return Boolean(filters[sectionName] && filters[sectionName][code]);
    };


    // Function to handle checkbox click
    const handleCheckBoxClick = (sectionName: string, code: string, checkboxValue: string) => {
        setSelectedFilters((prevValues) => {
            const updatedSection = { ...prevValues[sectionName] };
            // Check if checkboxValue is empty (indicating uncheck)
            if (!checkboxValue) {
                delete updatedSection[code];
            } else {
                updatedSection[code] = checkboxValue;
            }

            return {
                ...prevValues,
                [sectionName]: updatedSection
            };
        });


    };


    useEffect(() => {
        if(filtersApplied) getBusinesses();
    }, [filtersApplied])

    useEffect(() => {
        setState({
            ...state,
            filters: selectedFilters
        });
    }, [selectedFilters])

    useEffect(() => {
        if (businessData && filtersApplied) {
            setState({
                ...state,
                businesses: businessData.businessesLocations
            });

            navigation.goBack();
        }
    }, [businessData])



    const applyFilters = async () => {

        let query: string = '';
        const carWashType : any = {
            "Самообслуживание": "SelfService",
            "Робот": "Portal"
        };

        for (const key in selectedFilters) {
            const values = Object.values(selectedFilters[key]);
            if (key !== 'type' || Object.keys(selectedFilters[key]).length !== 2) {
                if (values.length > 0) {
                    values.forEach(value => {
                        if (key === 'type' && carWashType[value]) {
                            query += `${key}:${carWashType[value]},`;
                        } else {
                            query += `${key}:${value},`;
                        }
                    });
                }
            }
        }

        query = query.replace(/,$/, '');

        setQuery(query);
        setFiltersApplied(true);

    }



    return (
        <BottomSheetScrollView style={styles.container} nestedScrollEnabled={true}>
            {/* <View style={{paddingRight: dp(10)}}>
                <BackButton index={2} />
            </View> */}
            <SectionList
                contentContainerStyle={{
                    marginTop: dp(15)
                }}
                sections={data}
                renderItem={() => null}
                renderSectionHeader={({ section }) => (
                    <View>
                        <Text style={styles.sectionHeader}>{section.title.name}</Text>
                        <FlatList
                            horizontal
                            contentContainerStyle={{
                                marginTop: dp(25),
                                marginBottom: dp(40),
                                flexDirection:  'row',
                                flexShrink: 1,
                                flexWrap: 'wrap'

                            }}
                            data={section.data}
                            renderItem={({ item }) => (
                                <CheckBoxItem code={item.code} name={item.name} sectionName={section.title.code}  onCheckBoxClick={handleCheckBoxClick} checked={getCheckedState(section.title.code, item.code)} key={item.code}/>
                            )}
                            keyExtractor={(item) => `sectionListEntry-${item.code}`}
                        />
                    </View>
                )}
                keyExtractor={(item) => `sectionListEntry-${item.code}`}
            />
            <View style={styles.footer}>
                <Button label={"Применить"} color={"blue"} width={dp(172)} height={dp(43)} fontSize={dp(16)} fontWeight={"600"}  onClick={applyFilters} showLoading={isFetching}/>
            </View>

        </BottomSheetScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingTop: dp(15),
        paddingLeft: dp(22),
        paddingRight: dp(22),
        borderRadius: dp(38)

    },
    header: {
        alignItems: 'center'
    },
    list: {
        paddingLeft: dp(22)
    },
    headerTxt: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionHeader: {
        color: '#000',
        fontSize: dp(24),
        fontWeight: '600'
    },
    footer: {
        flex: 1,
        marginVertical: dp(100),
        alignItems: 'center'
    }

})

export { Filters };
