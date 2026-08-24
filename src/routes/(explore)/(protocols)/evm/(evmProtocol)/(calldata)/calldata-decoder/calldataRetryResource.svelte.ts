import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'

type RetryResourceFactory<Data> = () => SvelteKitResource<Data>

export class CalldataRetryResource<Data> {
	#factory: RetryResourceFactory<Data>
	#unsubscribe: (() => void) | undefined
	#generation = $state(0)
	#resource = $state.raw<SvelteKitResource<Data>>()
	#factoryKey: string
	#pending = $state(false)

	constructor(factory: RetryResourceFactory<Data>, factoryKey: string) {
		this.#factory = factory
		this.#factoryKey = factoryKey
		this.#replace()
	}

	get resource() {
		return this.#resource
	}

	get retryPending() {
		return this.#pending
	}

	setFactory(factory: RetryResourceFactory<Data>, factoryKey: string) {
		if (factoryKey === this.#factoryKey) return

		this.#factory = factory
		this.#factoryKey = factoryKey
		this.#pending = false
		this.#replace()
	}

	retry() {
		if (this.#pending) return

		this.#pending = true
		this.#replace()
	}

	destroy() {
		this.#unsubscribe?.()
		this.#unsubscribe = undefined
	}

	#replace() {
		this.#unsubscribe?.()
		this.#unsubscribe = undefined
		const generation = ++this.#generation
		const resource = this.#factory()
		this.#resource = resource
		this.#unsubscribe = resource.subscribe(() => {
			if (generation !== this.#generation) return
			if (resource.loading) return
			this.#pending = false
		})
	}
}
