<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadRadicleNodeInventory_Timestamp, {
		$node: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRadicleNodeInventory_TimestampView from '$/views/BlockheadRadicleNodeInventory_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead radicle node inventory timestamp' : pageSelection.entity.status || 'blockhead radicle node inventory timestamp')} • blockhead radicle node inventory timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead radicle node inventory timestamp'} • blockhead radicle node inventory timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadRadicleNodeInventory_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
