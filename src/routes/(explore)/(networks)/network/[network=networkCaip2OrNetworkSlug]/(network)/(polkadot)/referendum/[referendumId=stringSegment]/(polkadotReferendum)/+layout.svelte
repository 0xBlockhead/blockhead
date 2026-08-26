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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(polkadot)/referendum/[referendumId=stringSegment]',
			{
				network: params.network,
				referendumId: params.referendumId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotReferendum, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import PolkadotReferendumView from '$/views/PolkadotReferendumView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<PolkadotReferendumView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
