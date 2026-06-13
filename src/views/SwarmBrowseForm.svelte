<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
	}: {
		entityId?: EntityId<typeof schema, EntityType.SwarmResource>
	} = $props()


	// Functions
	const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

	const referenceFromInput = (value: string) => (
		trimSlashes(
			value.trim()
				.replace(/^bzz:\/\//i, '')
				.replace(/^swarm:\/\//i, '')
				.replace(/^https?:\/\/[^/]+\/bzz\//i, ''),
		)
	)

	const resourceAddressFromInput = ({
		targetInput,
		contentPathInput = '',
	}: {
		targetInput: string
		contentPathInput?: string
	}) => {
		const [reference, ...pathParts] = referenceFromInput(targetInput).split('/')
		if (reference === '') return undefined

		return {
			reference: reference.toLowerCase().replace(/^0x/, ''),
			contentPath: trimSlashes(
				contentPathInput.trim() !== '' ?
					contentPathInput
				:
					pathParts.join('/'),
			),
		}
	}

	const resourceHref = ({
		reference,
		contentPath,
	}: EntityId<typeof schema, EntityType.SwarmResource>) => (
		`/swarm/${encodeURIComponent(reference)}${contentPath === '' ? '' : `/path/${contentPath.split('/').map(encodeURIComponent).join('/')}`}`
	)

	const resourceCanonicalUri = ({
		reference,
		contentPath,
	}: EntityId<typeof schema, EntityType.SwarmResource>) => (
		`bzz://${reference}${contentPath === '' ? '' : `/${contentPath}`}`
	)

	const sample = ({
		label,
		targetInput,
		contentPathInput = '',
		sourceHref,
		sourceLabel,
	}: {
		label: string
		targetInput: string
		contentPathInput?: string
		sourceHref: string
		sourceLabel: string
	}) => {
		const address = resourceAddressFromInput({
			targetInput,
			contentPathInput,
		})
		if (address === undefined) throw new Error(`Invalid Swarm example: ${targetInput}`)

		return {
			label,
			sourceHref,
			sourceLabel,
			href: resourceHref(address),
			uri: resourceCanonicalUri(address),
		}
	}

	const onsubmit = (event: SubmitEvent) => {
		event.preventDefault()
		const form = event.currentTarget
		if (!(form instanceof HTMLFormElement)) return

		const formData = new FormData(form)
		const next = resourceAddressFromInput({
			targetInput: String(formData.get('target') ?? ''),
			contentPathInput: String(formData.get('path') ?? ''),
		})
		if (next === undefined) return

		window.location.assign(resourceHref(next))
	}

	const openSample = (href: string) => {
		window.location.assign(href)
	}

	const openDocsSample = (href: string) => {
		window.open(href, '_blank', 'noopener,noreferrer')
	}


	const samples = [
		sample({
			label: 'Bee docs landing page',
			targetInput: 'bzz://8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
			sourceHref: 'https://docs.ethswarm.org',
			sourceLabel: 'Swarm Docs',
		}),
		sample({
			label: 'Swarm URI scheme',
			targetInput: 'swarm://8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
			sourceHref: 'https://docs.ethswarm.org/docs/develop/upload-and-download/',
			sourceLabel: 'Upload & Download',
		}),
		sample({
			label: 'Gateway URL input',
			targetInput: 'https://gateway.ethswarm.org/bzz/8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
			sourceHref: 'https://docs.ethswarm.org/docs/develop/upload-and-download/',
			sourceLabel: 'Upload & Download',
		}),
	]


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<form
	class="swarm-browser-form"
	data-card
	data-column
	onsubmit={onsubmit}
>
	<div
		class="swarm-browser-fieldset"
		data-column
	>
		<label for="swarm-target-input">
			BZZ root / chunk reference, URI, or gateway URL
		</label>
		<input
			id="swarm-target-input"
			name="target"
			type="text"
			placeholder="bzz://..."
			value={entityId === undefined ? '' : `bzz://${entityId.reference}`}
		/>
	</div>

	<div
		class="swarm-browser-fieldset"
		data-column
	>
		<label for="swarm-path-input">
			Content path
		</label>
		<input
			id="swarm-path-input"
			name="path"
			type="text"
			placeholder="metadata.json"
			value={entityId?.contentPath ?? ''}
		/>
	</div>

	<div data-row="wrap">
		<button type="submit">
			Browse
		</button>
	</div>

	<details>
		<summary>
			Examples
		</summary>

		<ul>
			{#each samples as example (example.label)}
				<li data-column>
					<button
						type="button"
						onclick={() => openSample(example.href)}
					>
						{example.label}
					</button>
					<code>
						<TruncatedValue
							value={example.uri}
							format={TruncatedValueFormat.Visual}
						/>
					</code>
					<button
						type="button"
						onclick={() => openDocsSample(example.sourceHref)}
					>
						{example.sourceLabel}
					</button>
				</li>
			{/each}
		</ul>
	</details>
</form>


<style>
	.swarm-browser-form {
		gap: 1rem;
		padding: 1rem;
	}

	.swarm-browser-fieldset {
		gap: 0.5rem;
	}

	ul {
		gap: 1rem;
	}
</style>
