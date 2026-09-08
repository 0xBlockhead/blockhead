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
			'/(explore)/(ipfs)/[namespace=ipfsNamespace]/captures/[target=stringSegment]/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				namespace: params.namespace,
				target: params.target,
				timestampMs: params.timestampMs,
				source: params.source,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.IpfsResource_Timestamp, data.selector, {
		sources: [
			Source.Ipfs_Rest,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import IpfsResource_TimestampView from '$/views/IpfsResource_TimestampView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<IpfsResource_TimestampView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
