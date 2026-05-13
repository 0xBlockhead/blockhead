<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import {
		ipfsResourceAddressFromInput,
		ipfsResourceCanonicalUri,
		ipfsResourceHref,
	} from '$/lib/ipfs.ts'


	// Props
	let {
		entityId,
	}: {
		entityId?: EntityId<typeof schema, EntityType.IpfsResource>
	} = $props()


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
		const address = ipfsResourceAddressFromInput({
			targetInput,
			contentPathInput,
		})
		if (address == null) throw new Error(`Invalid IPFS example: ${targetInput}`)

		return {
			label,
			sourceHref,
			sourceLabel,
			href: ipfsResourceHref(address),
			uri: ipfsResourceCanonicalUri(address),
		}
	}

	const samples = [
		sample({
			label: 'Wikipedia article via CID path gateway example',
			targetInput: 'ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html',
			sourceHref: 'https://docs.ipfs.tech/how-to/address-ipfs-on-web/',
			sourceLabel: 'IPFS Docs',
		}),
		sample({
			label: 'Wikipedia article via ipfs.io path gateway',
			targetInput: 'https://ipfs.io/ipfs/bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html',
			sourceHref: 'https://docs.ipfs.tech/concepts/ipfs-gateway/',
			sourceLabel: 'IPFS Docs',
		}),
		sample({
			label: 'Wikipedia via DNSLink / IPNS homepage',
			targetInput: 'https://ipfs.io/ipns/tr.wikipedia-on-ipfs.org/wiki/Anasayfa.html',
			sourceHref: 'https://docs.ipfs.tech/concepts/ipfs-gateway/',
			sourceLabel: 'IPFS Docs',
		}),
		sample({
			label: 'Wikipedia via IPNS key example',
			targetInput: 'ipns://k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8',
			sourceHref: 'https://docs.ipfs.tech/concepts/ipfs-gateway/',
			sourceLabel: 'IPFS Docs',
		}),
	]

	const onsubmit = async (event: SubmitEvent) => {
		event.preventDefault()
		if (!(event.currentTarget instanceof HTMLFormElement)) return

		const formData = new FormData(event.currentTarget)
		const next = ipfsResourceAddressFromInput({
			targetInput: String(formData.get('target') ?? ''),
			contentPathInput: String(formData.get('path') ?? ''),
		})
		if (next == null) return

		window.location.assign(ipfsResourceHref(next))
	}

	const openSample = (href: string) => {
		window.location.assign(href)
	}

	const openDocsSample = (href: string) => {
		window.open(href, '_blank', 'noopener,noreferrer')
	}


	// Components
	import IpfsBrowseEntityChrome from '$/views/IpfsBrowseEntityChrome.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


{#snippet Form()}
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
				value={entityId === undefined ? '' : `${entityId.namespace}://${entityId.target}`}
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
{/snippet}


{#if entityId !== undefined}
	<IpfsBrowseEntityChrome
		{entityId}
		Form={Form}
	/>
{:else}
	<section
		class="ipfs-browser"
		data-column
	>
		{@render Form()}

		<section
			class="ipfs-browser-note"
			data-card
			data-column
		>
			<h2>Browse IPFS</h2>

			<p data-text="muted">
				Paste a CID, IPNS name, `ipfs://` URI, or public gateway URL to open an IPFS resource page.
			</p>
		</section>
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
