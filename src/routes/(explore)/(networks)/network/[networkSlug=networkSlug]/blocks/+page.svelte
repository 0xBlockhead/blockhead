<script lang="ts">
	// Types/constants
	import { NetworkNamespace } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		params,
	} = $props()

	const network = useEntity(
		EntityType.Network,
		{
			networkSlug: params.networkSlug,
		},
		{
			$: [
				Source.Constants_Internal,
			],
			caip2: {},
			namespace: {},
			slug: {},
		},
	)


	// Components
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BittensorBlocksView from '$/views/BittensorBlocksView.svelte'
	import CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
	import MoneroBlocksView from '$/views/MoneroBlocksView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
	import SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
	import TronBlocksView from '$/views/TronBlocksView.svelte'
	import UtxoBlocksView from '$/views/UtxoBlocksView.svelte'
	import ZeroGBlocksView from '$/views/ZeroGBlocksView.svelte'
</script>


<Page>
	<ResourceBoundary resource={network}>
		{#snippet children(network)}
			{@const href = resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/blocks', {
				networkSlug: params.networkSlug,
			})}
			{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
				<UtxoBlocksView
					entityFieldReference={{
						entityType: EntityType.UtxoNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Solana && network.caip2 != null}
				<SolanaBlocksView
					entityFieldReference={{
						entityType: EntityType.SolanaNetwork,
						entityId: {
							caip2: {
								namespace: 'solana',
								reference: network.caip2.reference,
							},
						},
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Cosmos}
				<CosmosBlocksView
					entityFieldReference={{
						entityType: EntityType.CosmosNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Filecoin}
				<FilecoinTipsetsView
					entityFieldReference={{
						entityType: EntityType.FilecoinNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$tipsets',
					}}
					{href}
					id="blocks"
					title="Tipsets"
				/>
			{:else if network.namespace === NetworkNamespace.Polkadot}
				<PolkadotBlocksView
					entityFieldReference={{
						entityType: EntityType.PolkadotNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Near}
				<NearBlocksView
					entityFieldReference={{
						entityType: EntityType.NearNetwork,
						entityId: { networkSlug: 'near' },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Tron}
				<TronBlocksView
					entityFieldReference={{
						entityType: EntityType.TronNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Monero}
				<MoneroBlocksView
					entityFieldReference={{
						entityType: EntityType.MoneroNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Hyperliquid}
				<HyperliquidBlocksView
					entityFieldReference={{
						entityType: EntityType.HyperliquidNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.Bittensor}
				<BittensorBlocksView
					entityFieldReference={{
						entityType: EntityType.BittensorNetwork,
						entityId: network.caip2 == null ?
							{ networkSlug: network.slug }
						:
							{ caip2: network.caip2 },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else if network.namespace === NetworkNamespace.ZeroG}
				<ZeroGBlocksView
					entityFieldReference={{
						entityType: EntityType.ZeroGNetwork,
						entityId: { networkSlug: '0g' },
						fieldName: '$$blocks',
					}}
					{href}
					id="blocks"
				/>
			{:else}
				<p data-text="muted">This network does not expose a block list route yet.</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>
