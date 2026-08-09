<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
			{
				network: params.network,
				blockNumber: params.blockNumber,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import ArweaveBlockView from '$/views/ArweaveBlockView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
	import HederaBlockView from '$/views/HederaBlockView.svelte'
	import HyperliquidBlockView from '$/views/HyperliquidBlockView.svelte'
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{@const DetailView = data.entityType === EntityType.EvmBlock ? EvmBlockView : data.entityType === EntityType.SolanaBlock ? SolanaBlockView : data.entityType === EntityType.UtxoBlock ? UtxoBlockView : data.entityType === EntityType.PolkadotBlock ? PolkadotBlockView : data.entityType === EntityType.ArweaveBlock ? ArweaveBlockView : data.entityType === EntityType.CosmosBlock ? CosmosBlockView : data.entityType === EntityType.HederaBlock ? HederaBlockView : data.entityType === EntityType.HyperliquidBlock ? HyperliquidBlockView : data.entityType === EntityType.MoneroBlock ? MoneroBlockView : data.entityType === EntityType.NearBlock ? NearBlockView : TronBlockView}

		<DetailView
			selection={select(data.entityType, data.selector)}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
