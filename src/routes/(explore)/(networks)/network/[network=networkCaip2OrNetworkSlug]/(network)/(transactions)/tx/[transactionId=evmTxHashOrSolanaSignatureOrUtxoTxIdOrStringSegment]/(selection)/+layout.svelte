<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
			{
				network: params.network,
				transactionId: params.transactionId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import ArweaveTransactionView from '$/views/ArweaveTransactionView.svelte'
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
	import HyperliquidTransactionView from '$/views/HyperliquidTransactionView.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
	import TronTransactionView from '$/views/TronTransactionView.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{#key data.selector}
				{@const DetailView = data.entityType === EntityType.EvmTransaction ? EvmTransactionView : data.entityType === EntityType.SolanaTransaction ? SolanaTransactionView : data.entityType === EntityType.CardanoTransaction ? CardanoTransactionView : data.entityType === EntityType.UtxoTransaction ? UtxoTransactionView : data.entityType === EntityType.ArweaveTransaction ? ArweaveTransactionView : data.entityType === EntityType.CosmosTransaction ? CosmosTransactionView : data.entityType === EntityType.HyperliquidTransaction ? HyperliquidTransactionView : data.entityType === EntityType.MoneroTransaction ? MoneroTransactionView : data.entityType === EntityType.NearTransaction ? NearTransactionView : data.entityType === EntityType.TronTransaction ? TronTransactionView : AptosTransactionView}

				<DetailView
					selection={untrack(() => select(data.entityType, data.selector))}
					href={detailHref}
					layout={EntityLayout.SummaryInline}
				/>
			{/key}
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
