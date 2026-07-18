export const applicationRuntimeWhenReady = <_Client>(
	clientPromise: Promise<_Client>,
	mount: (client: _Client) => {
		destroy: () => void
	}
) => {
	let active = true
	let destroyRuntime: (() => void) | undefined

	return {
		ready: clientPromise.then((client) => {
			if (active)
				destroyRuntime = mount(client).destroy
		}),
		destroy: () => {
			active = false
			const destroy = destroyRuntime
			destroyRuntime = undefined
			destroy?.()
		},
	}
}
