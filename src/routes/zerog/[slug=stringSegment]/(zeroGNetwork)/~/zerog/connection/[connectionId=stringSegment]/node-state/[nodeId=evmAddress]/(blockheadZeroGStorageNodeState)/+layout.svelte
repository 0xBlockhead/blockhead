<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			'/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]',
			{
				slug: params.slug,
				connectionId: params.connectionId,
				nodeId: params.nodeId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadZeroGStorageNodeState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<BlockheadZeroGStorageNodeStateView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
