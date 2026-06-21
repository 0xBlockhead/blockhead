<script lang="ts">
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	const network = $derived(select(EntityType.Network,
		{
			slug: params.networkSlug,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { namespace: true } }),
	))


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
	import ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
			{#snippet children(network)}
				{#if network.fields.namespace === NetworkNamespace.Lightning}
					<LightningNodeView
						selection={select(EntityType.LightningNode, {
							$network: { slug: params.networkSlug },
							publicKey: params.pubkey,
						})}
					/>
				{:else if network.fields.namespace === NetworkNamespace.ZeroG}
					<ZeroGStorageNodeView
						selection={select(EntityType.ZeroGStorageNode, {
							$network: { slug: params.networkSlug },
							nodeId: EvmAddress.assert(params.pubkey),
						})}
					/>
			{:else}
				<p data-text="muted">This network does not expose a node detail route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
