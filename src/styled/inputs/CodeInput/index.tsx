import { GREY, YELLOW } from '../../../utils/colors'
import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, TextInput, Text } from 'react-native'

import { dp } from "../../../utils/dp"

interface CodeInputProps {
    verify: (code: string) => void
    error: boolean
    setError: any
}

const CodeInput = ({ verify, error, setError } : CodeInputProps) => {

    const pin1Ref = useRef<any>(null)
    const pin2Ref = useRef<any>(null)
    const pin3Ref = useRef<any>(null)
    const pin4Ref = useRef<any>(null)

    const [pin1, setPin1] = useState<null | string>(null)
    const [pin2, setPin2] = useState<null | string>(null)
    const [pin3, setPin3] = useState<null | string>(null)
    const [pin4, setPin4] = useState<null | string>(null)

    const submit = () => {
        if (pin1 && pin2 && pin3 && pin4) {
            const res: string = pin1 + pin2 + pin3 + pin4

            verify(res)
        }
    }

    useEffect(() => {
        if (pin4) {
            submit()
        }
    }, [pin4])

    const setColor = () => {
        if (error) {
            return "green"
        }

        return "black"
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', flexDirection: "row", justifyContent: "space-around" }}>
            <View style={styles.textInputView}>
                    <TextInput 
                        keyboardType={"number-pad"}
                        maxLength={1}
                        onChangeText={(pin: string) => {
                            if (error) {
                                setError(false)
                            }
                            setPin1(pin)
                            if (pin) {
                                pin2Ref.current.focus()
                            }
                        }}
                        style={{...styles.textInputText, color: YELLOW, borderBottomColor: !error ? (pin1 ? "#BFFA00" : "#A3A3A6") : "#FF0000" }}
                        ref={pin1Ref}
                        underlineColorAndroid="transparent"
                    />
            </View>
            <View style={styles.textInputView}>
                <TextInput 
                    keyboardType={"number-pad"}
                    maxLength={1}
                    onChangeText={(pin) => {
                        if (error) {
                            setError(false)
                        }
                        setPin2(pin)
                        if (pin) {
                            pin3Ref.current.focus()
                        } else {
                            pin1Ref.current.focus()
                        }
                    }}
                    onKeyPress={({nativeEvent}) => {
                        if (nativeEvent.key === 'Backspace') {
                             pin1Ref.current.focus()
                        }
                    }}
                    style={{...styles.textInputText, color: YELLOW, borderBottomColor: !error ? (pin2 ? "#BFFA00" : "#A3A3A6") : "#FF0000" }}
                    underlineColorAndroid="transparent"
                    ref={pin2Ref}
                />
            </View>
            <View style={styles.textInputView}>
                <TextInput 
                    keyboardType={"number-pad"}
                    maxLength={1}
                    onChangeText={(pin) => {
                        if (error) {
                            setError(false)
                        }
                        setPin3(pin)
                        if (pin) {
                            pin4Ref.current.focus()
                        } else {
                            pin2Ref.current.focus()
                        }
                    }}
                    onKeyPress={({nativeEvent}) => {
                        if (nativeEvent.key === 'Backspace') {
                             pin2Ref.current.focus()
                        }
                    }}
                    style={{...styles.textInputText, color: YELLOW, borderBottomColor: !error ? (pin3 ? "#BFFA00" : "#A3A3A6") : "#FF0000" }}
                    underlineColorAndroid="transparent"
                    ref={pin3Ref}
                />
            </View>
            <View style={styles.textInputView}>
                <TextInput 
                    keyboardType={"number-pad"}
                    maxLength={1}
                    onChangeText={(pin) => {
                        if (error) {
                            setError(false)
                        }
                        setPin4(pin)
                        if (!pin) {
                            pin3Ref.current.focus()
                        } 
                    }}
                    onKeyPress={({nativeEvent}) => {
                        if (nativeEvent.key === 'Backspace') {
                             pin3Ref.current.focus()
                        }
                    }}
                    style={{...styles.textInputText, color: YELLOW, borderBottomColor: !error ? (pin4 ? "#BFFA00" : "#A3A3A6") : "#FF0000" }}
                    underlineColorAndroid="transparent"
                    ref={pin4Ref}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textInputView: {
        width: dp(50),
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: dp(120),
    },
    textInputText: {
        marginTop: dp(20),
        fontSize: dp(40),
        textAlign: 'center',
        justifyContent: 'center',
        padding: 10,
        borderBottomWidth: 1,
    },
    textInputTextActive: {
        fontSize: dp(40),
    }
})

export { CodeInput }

