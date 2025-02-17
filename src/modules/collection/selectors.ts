import { createSelector } from 'reselect'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { Transaction } from 'decentraland-dapps/dist/modules/transaction/types'
import { RootState } from 'modules/common/types'
import { getPendingTransactions } from 'modules/transaction/selectors'
import { getItems } from 'modules/item/selectors'
import { isEqual } from 'lib/address'
import { SET_COLLECTION_MINTERS_SUCCESS } from './actions'
import { Collection } from './types'
import { CollectionState } from './reducer'
import { canSeeCollection } from './utils'

export const getState = (state: RootState) => state.collection
export const getData = (state: RootState) => getState(state).data
export const getLoading = (state: RootState) => getState(state).loading
export const getError = (state: RootState) => getState(state).error

export const getCollections = createSelector<RootState, CollectionState['data'], string | undefined, Collection[]>(
  getData,
  getAddress,
  collectionData => Object.values(collectionData)
)

export const getWalletCollections = createSelector<RootState, Collection[], string | undefined, Collection[]>(
  getCollections,
  getAddress,
  (collections, address) => collections.filter(collection => address && isEqual(collection.owner, address))
)

export const getAuthorizedCollections = createSelector<RootState, Collection[], string | undefined, Collection[]>(
  getCollections,
  getAddress,
  (collections, address) => collections.filter(collection => address && canSeeCollection(collection, address))
)

export const getCollection = (state: RootState, collectionId: string) => {
  const collections = getCollections(state)
  return collections.find(collection => collection.id === collectionId) || null
}

export const getCollectionItems = (state: RootState, collectionId: string) => {
  const allItems = getItems(state)
  return allItems.filter(item => item.collectionId === collectionId)
}

export const isOnSaleLoading = createSelector<RootState, Transaction[], boolean>(getPendingTransactions, transactions =>
  transactions.some(transaction => transaction.actionType === SET_COLLECTION_MINTERS_SUCCESS)
)
