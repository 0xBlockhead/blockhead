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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/object/[objectId=stringSegment]/(suiObject)/dynamic-field/[fieldNameHash=stringSegment]/[childObjectId=stringSegment]',
			{
				network: params.network,
				objectId: params.objectId,
				fieldNameHash: params.fieldNameHash,
				childObjectId: params.childObjectId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import SuiDynamicFieldEdgeView from '$/views/SuiDynamicFieldEdgeView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<SuiDynamicFieldEdgeView
				selection={select(EntityType.SuiDynamicFieldEdge, data.selector)}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
