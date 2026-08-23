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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import TezosBakingRightView from '$/views/TezosBakingRightView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{#key data.selector}
				<TezosBakingRightView
					selection={untrack(() => select(EntityType.TezosBakingRight, data.selector))}
					href={detailHref}
					layout={EntityLayout.SummaryInline}
				/>
			{/key}
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
