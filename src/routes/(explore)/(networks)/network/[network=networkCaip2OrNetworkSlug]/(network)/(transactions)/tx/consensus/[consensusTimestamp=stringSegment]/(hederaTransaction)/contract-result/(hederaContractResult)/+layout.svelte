<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result',
			{
				network: params.network,
				consensusTimestamp: params.consensusTimestamp,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaContractResult, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import HederaContractResultView from '$/views/HederaContractResultView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<HederaContractResultView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
