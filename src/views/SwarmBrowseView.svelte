<script lang="ts">
	// Types/constants
	import {
		swarmResourceAddressFromInput,
		swarmResourceCanonicalUri,
		swarmResourceHref,
	} from '$/sources/Swarm/Rest/queries.ts'


	// Functions
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
		const address = swarmResourceAddressFromInput({
			targetInput,
			contentPathInput,
		})
		if (address === undefined) throw new Error(`Invalid Swarm example: ${targetInput}`)

		return {
			label,
			sourceHref,
			sourceLabel,
			href: swarmResourceHref(address),
			uri: swarmResourceCanonicalUri(address),
		}
	}

	const samples = [
		sample({
			label: 'Bee docs landing page',
			targetInput: 'bzz://8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
			sourceHref: 'https://docs.ethswarm.org',
			sourceLabel: 'Swarm Docs',
		}),
		sample({
			label: 'Gateway URL input',
			targetInput: 'https://gateway.ethswarm.org/bzz/8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
			sourceHref: 'https://docs.ethswarm.org/docs/develop/upload-and-download/',
			sourceLabel: 'Upload & Download',
		}),
	]


	// Actions
	const onsubmit = (event: SubmitEvent) => {
		event.preventDefault()
		const form = event.currentTarget
		if (!(form instanceof HTMLFormElement)) return

		const formData = new FormData(form)
		const next = swarmResourceAddressFromInput({
			targetInput: String(formData.get('target') ?? ''),
			contentPathInput: String(formData.get('path') ?? ''),
		})
		if (next === undefined) return

		window.location.assign(swarmResourceHref(next))
	}

	const openSample = (href: string) => {
		window.location.assign(href)
	}

	const openDocsSample = (href: string) => {
		window.open(href, '_blank', 'noopener,noreferrer')
	}


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<section
	class="swarm-browser"
	data-column
>
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

	<section
		class="swarm-browser-note"
		data-card
		data-column
	>
		<div data-row="wrap align-center gap-2">
			<h2>Browse Swarm</h2>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Ethereum Swarm stores content under BZZ root hashes and manifest paths; gateways expose that over HTTPS.
					</p>
					<p>
						That model differs from IPFS CIDs or ordinary single-page URLs.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About Swarm browsing"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	</section>
</section>


<style>
	.swarm-browser {
		gap: 1rem;
	}

	.swarm-browser-form,
	.swarm-browser-note {
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
