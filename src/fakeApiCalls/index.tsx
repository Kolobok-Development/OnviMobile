// program to generate random strings

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length: number) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export function fakeCall() {
    return {
        config: {
            env: {
                data: {
                    user: {
                        id: 1,
                        phone: '+79091691081',
                    },
                    cardNumber: 1,
                    cardUnqNumber: 1,
                    card: 'Card',
                    refreshToken: 'abcde',
                    accessToken: generateString(5),
                    expiredDate: new Date(Date.now() + 5*6000),
                }
            }
        }
    }
}

export function SignCall() {
    return {
        data: {
            user: {
                id: 1,
                phone: '+79091691081',
            },
            cardNumber: 1,
            cardUnqNumber: 1,
            card: 'Card',
            refreshToken: 'abcde',
            accessToken: generateString(5),
            expiredDate: new Date(Date.now() + 5*6000),
        }
    }
}