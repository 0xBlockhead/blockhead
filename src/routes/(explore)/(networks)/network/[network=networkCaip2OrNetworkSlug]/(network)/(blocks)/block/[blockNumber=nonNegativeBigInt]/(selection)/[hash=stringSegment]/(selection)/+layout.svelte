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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
			{
				network: params.network,
				blockNumber: params.blockNumber,
				hash: params.hash,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import BittensorBlockView from '$/views/BittensorBlockView.svelte'
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
	import TronBlockView from '$/views/TronBlockView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{@const DetailView = data.entityType === EntityType.PolkadotBlock ? PolkadotBlockView : data.entityType === EntityType.UtxoBlock ? UtxoBlockView : data.entityType === EntityType.BittensorBlock ? BittensorBlockView : data.entityType === EntityType.MoneroBlock ? MoneroBlockView : data.entityType === EntityType.NearBlock ? NearBlockView : TronBlockView}

			<DetailView
				selection={select(data.entityType, data.selector)}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
