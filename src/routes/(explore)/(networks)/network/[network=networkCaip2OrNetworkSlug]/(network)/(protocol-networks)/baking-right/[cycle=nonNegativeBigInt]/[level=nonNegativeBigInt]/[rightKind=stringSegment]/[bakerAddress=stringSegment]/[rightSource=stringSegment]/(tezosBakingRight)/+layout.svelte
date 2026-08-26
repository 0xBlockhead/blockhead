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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baking-right/[cycle=nonNegativeBigInt]/[level=nonNegativeBigInt]/[rightKind=stringSegment]/[bakerAddress=stringSegment]/[rightSource=stringSegment]',
			{
				network: params.network,
				cycle: params.cycle,
				level: params.level,
				rightKind: params.rightKind,
				bakerAddress: params.bakerAddress,
				rightSource: params.rightSource,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosBakingRight, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import TezosBakingRightView from '$/views/TezosBakingRightView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<TezosBakingRightView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
