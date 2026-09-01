export function applicationRuntimeWhenReady<_Client>(
	clientPromise: Promise<_Client>,
	mount: (client: _Client) => {
		destroy: () => void
	},
	disposeUnclaimed: (client: _Client) => void = () => {}
) {
	let active = true
	let destroyRuntime: (() => void) | undefined

	return {
		ready: clientPromise.then((client) => {
			if (!active) {
				disposeUnclaimed(client)
				return
			}

			const runtime = mount(client)
			if (!active) {
				runtime.destroy()
				return
			}

			destroyRuntime = runtime.destroy
		}),
		destroy: () => {
			active = false
			const destroy = destroyRuntime
			destroyRuntime = undefined
			destroy?.()
		},
	}
}
