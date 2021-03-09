import { connect } from 'react-redux'
import { RootState } from 'modules/common/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { grantTokenRequest, revokeTokenRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getWallet } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { getData, getTransactions } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { MapStateProps, MapDispatchProps, MapDispatch, OwnProps } from './AuthorizationModal.types'
import AuthorizationModal from './AuthorizationModal'
import { areEqual } from 'decentraland-dapps/dist/modules/authorization/utils'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const hasPendingTransaction = getTransactions(state).some(
    tx => areEqual(tx.payload.authorization, ownProps.authorization) && isPending(tx.status)
  )

  return {
    wallet: getWallet(state)!,
    authorizations: getData(state),
    hasPendingTransaction
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: (authorization: Authorization) => dispatch(grantTokenRequest(authorization)),
  onRevoke: (authorization: Authorization) => dispatch(revokeTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
