<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// Context


	// Functions
	import {
		ipfsResourceAddressFromInput,
		ipfsResourceCanonicalUri,
		ipfsResourceHref,
	} from '$/lib/ipfs.ts'

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
		const address = ipfsResourceAddressFromInput({
			targetInput,
			contentPathInput,
		})
		if (address === undefined) throw new Error(`Invalid IPFS example: ${targetInput}`)

		return {
			label,
			sourceHref,
			sourceLabel,
			href: ipfsResourceHref(address),
			uri: ipfsResourceCanonicalUri(address),
		}
	}

	const exampleResources = [
		exampleResource({
			label: 'Wikipedia article via CID path gateway example',
			targetInput: 'ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html',
			sourceHref: 'https://docs.ipfs.tech/how-to/address-ipfs-on-web/',
			sourceLabel: 'IPFS Docs',
		}),
		exampleResource({
			label: 'Wikipedia article via ipfs.io path gateway',
			targetInput: 'https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html',
			sourceHref: 'https://docs.ipfs.tech/concepts/ipfs-gateway/',
			sourceLabel: 'IPFS Docs',
		}),
		exampleResource({
			label: 'Wikipedia via DNSLink / IPNS homepage',
			targetInput: 'https://ipfs.io/ipns/tr.wikipedia-on-ipfs.org/wiki/Anasayfa.html',
			sourceHref: 'https://docs.ipfs.tech/concepts/ipfs-gateway/',
			sourceLabel: 'IPFS Docs',
		}),
		exampleResource({
			label: 'Wikipedia via IPNS key example',
			targetInput: 'ipns://k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8',
			sourceHref: 'https://docs.ipfs.tech/concepts/ipfs-gateway/',
			sourceLabel: 'IPFS Docs',
		}),
	]


	// Props
	let {
		entityId,
	}: {
		entityId?: EntityId<typeof schema, EntityType.IpfsResource>
	} = $props()


	// (Derived)
	const targetValue = $derived(
		entityId === undefined ?
			''
		:
			`${entityId.namespace}://${entityId.target}`,
	)

	const contentPathValue = $derived(
		entityId?.contentPath ?? '',
	)

	const currentCanonicalUri = $derived(
		entityId === undefined ?
			undefined
		:
			ipfsResourceCanonicalUri(entityId),
	)


	// Actions
	const onsubmit = async (event: SubmitEvent) => {
		event.preventDefault()
		if (!(event.currentTarget instanceof HTMLFormElement)) return

		const formData = new FormData(event.currentTarget)
		const nextResource = ipfsResourceAddressFromInput({
			targetInput: String(formData.get('target') ?? ''),
			contentPathInput: String(formData.get('path') ?? ''),
		})
		if (nextResource === undefined) return

		window.location.assign(ipfsResourceHref(nextResource))
	}

	const openExample = (href: string) => {
		window.location.assign(href)
	}

	const openDocsExample = (href: string) => {
		window.open(href, '_blank', 'noopener,noreferrer')
	}
</script>


{#snippet IpfsBrowseBody()}
	<form
		class="ipfs-browser-form"
		data-card
		data-column
		onsubmit={onsubmit}
	>
		<div
			class="ipfs-browser-fieldset"
			data-column
		>
			<label for="ipfs-target-input">
				CID, IPNS name, IPFS URI, or gateway URL
			</label>
			<input
				id="ipfs-target-input"
				name="target"
				type="text"
				placeholder="bafybeigdyrzt..."
				value={targetValue}
			/>
		</div>

		<div
			class="ipfs-browser-fieldset"
			data-column
		>
			<label for="ipfs-path-input">
				Content path
			</label>
			<input
				id="ipfs-path-input"
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
		class="ipfs-browser-note"
		data-card
		data-column
	>
		<h2>Browse IPFS</h2>

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
				Paste a CID, IPNS name, `ipfs://` URI, or public gateway URL to open an IPFS resource page.
			</p>
		{/if}
	</section>
{/snippet}

{#if entityId !== undefined}
	<EntityView
		layout={EntityLayout.Details}
		entityType={EntityType.IpfsResource}
		{entityId}
		href={ipfsResourceHref(entityId)}
		title={ipfsResourceCanonicalUri(entityId)}
	>
		{#snippet Details()}
			<section
				class="ipfs-browser"
				data-column
			>
				{@render IpfsBrowseBody()}
			</section>
		{/snippet}
	</EntityView>
{:else}
	<section
		class="ipfs-browser"
		data-column
	>
		{@render IpfsBrowseBody()}
	</section>
{/if}


<style>
	.ipfs-browser {
		gap: 1rem;
	}

	.ipfs-browser-form,
	.ipfs-browser-note {
		gap: 1rem;
		padding: 1rem;
	}

	.ipfs-browser-fieldset {
		gap: 0.5rem;
	}

	ul {
		gap: 1rem;
	}
</style>
