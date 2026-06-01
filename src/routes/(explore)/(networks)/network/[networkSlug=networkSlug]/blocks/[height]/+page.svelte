<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		params,
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		{ networkSlug: params.networkSlug },
		{
			$: [Source.Constants_Internal],
			namespace: {},
			slug: {},
		},
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
			{@const entityId = { networkSlug: network.slug }}
			{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
				<UtxoBlockView entityId={{ $network: entityId, height: BigInt(params.height) }} />
			{:else if network.namespace === NetworkNamespace.Cosmos}
				<CosmosBlockView entityId={{ $network: entityId, height: BigInt(params.height) }} />
			{:else if network.namespace === NetworkNamespace.Solana}
				<SolanaBlockView entityId={{ $network: entityId, slot: BigInt(params.height) }} />
			{:else if network.namespace === NetworkNamespace.Polkadot}
				<PolkadotBlockView entityId={{ $network: entityId, blockNumber: BigInt(params.height) }} />
			{:else}
				<p data-text="muted">Block detail not available for this network type yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
