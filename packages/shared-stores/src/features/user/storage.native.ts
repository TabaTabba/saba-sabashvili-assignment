import AsyncStorage from '@react-native-async-storage/async-storage'

import { createUserStorage } from './createUserStorage'

export const userStorage = createUserStorage(AsyncStorage)
