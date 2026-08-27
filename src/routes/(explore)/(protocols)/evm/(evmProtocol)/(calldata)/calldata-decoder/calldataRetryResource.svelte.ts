import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'

type RetryResourceFactory<Data> = () => SvelteKitResource<Data>

export class CalldataRetryResource<Data> {
	#factory: RetryResourceFactory<Data>
	#generation = 0
	#resource: SvelteKitResource<Data>
	#factoryKey: string
	#pending = $state(false)

	constructor(factory: RetryResourceFactory<Data>, factoryKey: string) {
		this.#factory = factory
		this.#factoryKey = factoryKey
		this.#resource = $state.raw(this.#replace())
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
		this.#resource = this.#replace()
	}

	retry() {
		if (this.#pending) return

		this.#pending = true
		this.#resource = this.#replace()
	}

	destroy() {
		this.#generation += 1
	}

	#replace() {
		const generation = ++this.#generation
		const resource = this.#factory()
		const settled = () => {
			if (generation !== this.#generation) return
			this.#pending = false
		}
		void resource.then(settled, settled)
		return resource
	}
}
