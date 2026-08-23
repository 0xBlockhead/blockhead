<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleNodeInventory_TimestampView from '$/views/BlockheadRadicleNodeInventory_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadRadicleNodeInventory_Timestamp, {
				$node: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					status: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead radicle node inventory timestamp' : pageSelection.entity.status || 'blockhead radicle node inventory timestamp')} • blockhead radicle node inventory timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead radicle node inventory timestamp'} • blockhead radicle node inventory timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadRadicleNodeInventory_Timestamp, {
				$node: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
				fields: {
					status: true,
				},
			})}

	<BlockheadRadicleNodeInventory_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
