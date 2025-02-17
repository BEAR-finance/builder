import { all } from 'redux-saga/effects'

import { createAuthorizationSaga } from 'decentraland-dapps/dist/modules/authorization/sagas'
import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'

import { analyticsSaga } from 'modules/analytics/sagas'
import { assetPackSaga } from 'modules/assetPack/sagas'
import { assetSaga } from 'modules/asset/sagas'
import { collectionSaga } from 'modules/collection/sagas'
import { committeeSaga } from 'modules/committee/sagas'
import { deploymentSaga } from 'modules/deployment/sagas'
import { editorSaga } from 'modules/editor/sagas'
import { ensSaga } from 'modules/ens/sagas'
import { forumSaga } from 'modules/forum/sagas'
import { identitySaga } from 'modules/identity/sagas'
import { itemSaga } from 'modules/item/sagas'
import { keyboardSaga } from 'modules/keyboard/sagas'
import { landSaga } from 'modules/land/sagas'
import { locationSaga } from 'modules/location/sagas'
import { mediaSaga } from 'modules/media/sagas'
import { modalSaga } from 'modules/modal/sagas'
import { poolGroupSaga } from 'modules/poolGroup/sagas'
import { poolSaga } from 'modules/pool/sagas'
import { projectSaga } from 'modules/project/sagas'
import { sceneSaga } from 'modules/scene/sagas'
import { statsSaga } from 'modules/stats/sagas'
import { syncSaga } from 'modules/sync/sagas'
import { tileSaga } from 'modules/tile/sagas'
import { toastSaga } from 'modules/toast/sagas'
import { translationSaga } from 'modules/translation/sagas'
import { uiSaga } from 'modules/ui/sagas'
import { walletSaga } from 'modules/wallet/sagas'

import { PEER_URL } from 'lib/api/peer'
import { TRANSACTIONS_API_URL } from 'modules/wallet/utils'

const profileSaga = createProfileSaga({ peerUrl: PEER_URL })
const authorizationSaga = createAuthorizationSaga({ metaTransactionServerUrl: TRANSACTIONS_API_URL })

export function* rootSaga() {
  yield all([
    analyticsSaga(),
    assetPackSaga(),
    assetSaga(),
    authorizationSaga(),
    collectionSaga(),
    committeeSaga(),
    deploymentSaga(),
    editorSaga(),
    ensSaga(),
    forumSaga(),
    identitySaga(),
    itemSaga(),
    keyboardSaga(),
    landSaga(),
    locationSaga(),
    mediaSaga(),
    modalSaga(),
    poolGroupSaga(),
    poolSaga(),
    profileSaga(),
    projectSaga(),
    sceneSaga(),
    statsSaga(),
    syncSaga(),
    tileSaga(),
    toastSaga(),
    transactionSaga(),
    translationSaga(),
    uiSaga(),
    walletSaga()
  ])
}
