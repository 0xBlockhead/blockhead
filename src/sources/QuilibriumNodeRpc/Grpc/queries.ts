import type {
	QuilibriumBalanceAccountResponse,
	QuilibriumDecryptableBalanceAccountRequest,
	QuilibriumDecryptablePendingTransactionsAccountRequest,
	QuilibriumGrpcUnaryCall,
	QuilibriumPendingTransactionsAccountResponse,
} from '$/sources/QuilibriumNodeRpc/Grpc/types.ts'

const accountService = 'quilibrium.node.node.pb.AccountService'

export const getQuilibriumAccountBalance = ({
	callUnary,
	request,
}: {
	callUnary: QuilibriumGrpcUnaryCall
	request: QuilibriumDecryptableBalanceAccountRequest
}) => (
	callUnary<
		QuilibriumDecryptableBalanceAccountRequest,
		QuilibriumBalanceAccountResponse
	>({
		service: accountService,
		method: 'GetBalance',
		request,
	})
)

export const listQuilibriumPendingTransactions = ({
	callUnary,
	request,
}: {
	callUnary: QuilibriumGrpcUnaryCall
	request: QuilibriumDecryptablePendingTransactionsAccountRequest
}) => (
	callUnary<
		QuilibriumDecryptablePendingTransactionsAccountRequest,
		QuilibriumPendingTransactionsAccountResponse
	>({
		service: accountService,
		method: 'ListPendingTransactions',
		request,
	})
)
