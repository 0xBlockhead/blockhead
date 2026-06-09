<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		params,
	} = $props()

	const network = useEntity(entityCollectionsContext, EntityType.Network,
		{ networkSlug: params.networkSlug },
		({ sources: [Source.Constants_Internal], fields: { namespace: true, slug: true } }),
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const entityId = { networkSlug: network.fields.slug }}
			{#if network.fields.namespace === NetworkNamespace.Bitcoin || network.fields.namespace === NetworkNamespace.BitcoinCash || network.fields.namespace === NetworkNamespace.Litecoin || network.fields.namespace === NetworkNamespace.Dogecoin || network.fields.namespace === NetworkNamespace.Zcash}
				<UtxoBlockView entityId={{ $network: entityId, height: BigInt(params.height) }} />
			{:else if network.fields.namespace === NetworkNamespace.Cosmos}
				<CosmosBlockView entityId={{ $network: entityId, height: BigInt(params.height) }} />
			{:else if network.fields.namespace === NetworkNamespace.Solana}
				<SolanaBlockView entityId={{ $network: entityId, slot: BigInt(params.height) }} />
			{:else if network.fields.namespace === NetworkNamespace.Polkadot}
				<PolkadotBlockView entityId={{ $network: entityId, blockNumber: BigInt(params.height) }} />
			{:else}
				<p data-text="muted">Block detail not available for this network type yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
