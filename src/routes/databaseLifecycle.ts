export const databaseCloseWhenReady = (
	databasePromise: Promise<{
		close?: () => Promise<void> | void
	}>
) => {
	let closePromise: Promise<void> | undefined

	return () => closePromise ??= databasePromise
		.then((database) => database.close?.())
		.then(() => undefined)
}
