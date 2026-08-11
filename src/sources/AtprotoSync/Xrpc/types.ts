export type AtprotoSyncSubscribeReposMessage = {
	type:
		| '#account'
		| '#commit'
		| '#identity'
		| '#info'
		| '#sync'
	body: object
}
