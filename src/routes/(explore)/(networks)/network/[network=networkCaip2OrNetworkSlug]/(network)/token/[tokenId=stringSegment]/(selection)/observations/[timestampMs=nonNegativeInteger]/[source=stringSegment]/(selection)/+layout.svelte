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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				network: params.network,
				tokenId: params.tokenId,
				timestampMs: params.timestampMs,
				source: params.source,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import HederaToken_TimestampView from '$/views/HederaToken_TimestampView.svelte'
	import TronToken_TimestampView from '$/views/TronToken_TimestampView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{@const DetailView = data.entityType === EntityType.HederaToken_Timestamp ? HederaToken_TimestampView : TronToken_TimestampView}

			<DetailView
				selection={select(data.entityType, data.selector)}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
