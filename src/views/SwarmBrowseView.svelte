<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// Functions
	import {
		swarmResourceAddressFromInput,
		swarmResourceCanonicalUri,
		swarmResourceHref,
	} from '$/sources/Swarm/Rest/queries.ts'

	const exampleResource = ({
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

	const exampleResources = [
		exampleResource({
			label: 'Bee docs landing page',
			targetInput: 'bzz://8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
			sourceHref: 'https://docs.ethswarm.org',
			sourceLabel: 'Swarm Docs',
		}),
		exampleResource({
			label: 'Gateway URL input',
			targetInput: 'https://gateway.ethswarm.org/bzz/8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1',
			sourceHref: 'https://docs.ethswarm.org/docs/develop/upload-and-download/',
			sourceLabel: 'Upload & Download',
		}),
	]


	// Props
	let {
		entityId,
	}: {
		entityId?: EntityId<typeof schema, EntityType.SwarmResource>
	} = $props()


	// (Derived)
	const targetValue = $derived(
		entityId === undefined ?
			''
		:
			`bzz://${entityId.reference}`,
	)

	const contentPathValue = $derived(
		entityId?.contentPath ?? '',
	)

	const currentCanonicalUri = $derived(
		entityId === undefined ?
			undefined
		:
			swarmResourceCanonicalUri(entityId),
	)


	// Actions
	const onsubmit = async (event: SubmitEvent) => {
		event.preventDefault()
		if (!(event.currentTarget instanceof HTMLFormElement)) return

		const formData = new FormData(event.currentTarget)
		const nextResource = swarmResourceAddressFromInput({
			targetInput: String(formData.get('target') ?? ''),
			contentPathInput: String(formData.get('path') ?? ''),
		})
		if (nextResource === undefined) return

		window.location.assign(swarmResourceHref(nextResource))
	}

	const openExample = (href: string) => {
		window.location.assign(href)
	}

	const openDocsExample = (href: string) => {
		window.open(href, '_blank', 'noopener,noreferrer')
	}
</script>


{#snippet SwarmBrowseBody()}
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
				BZZ reference, URI, or gateway URL
			</label>
			<input
				id="swarm-target-input"
				name="target"
				type="text"
				placeholder="bzz://..."
				value={targetValue}
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
				value={contentPathValue}
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
				{#each exampleResources as example (example.label)}
					<li data-column>
						<button
							type="button"
							onclick={() => openExample(example.href)}
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
							onclick={() => openDocsExample(example.sourceHref)}
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
		<h2>Browse Swarm</h2>

		{#if currentCanonicalUri !== undefined}
			<p data-text="muted">
				Current resource:
				<code>
					<TruncatedValue
						value={currentCanonicalUri}
						format={TruncatedValueFormat.Visual}
					/>
				</code>
			</p>
		{:else}
			<p data-text="muted">
				Paste a BZZ reference, `bzz://` URI, or gateway URL to open a resolver-backed Swarm resource page.
			</p>
		{/if}
	</section>
{/snippet}

{#if entityId !== undefined}
	<EntityView
		layout={EntityLayout.Details}
		entityType={EntityType.SwarmResource}
		{entityId}
		href={swarmResourceHref(entityId)}
		title={swarmResourceCanonicalUri(entityId)}
	>
		{#snippet Details()}
			<section
				class="swarm-browser"
				data-column
			>
				{@render SwarmBrowseBody()}
			</section>
		{/snippet}
	</EntityView>
{:else}
	<section
		class="swarm-browser"
		data-column
	>
		{@render SwarmBrowseBody()}
	</section>
{/if}


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
