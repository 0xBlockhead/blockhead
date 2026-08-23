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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadActionOutcome_Timestamp, {
		$outcome: data.selector,
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
	import BlockheadActionOutcome_TimestampView from '$/views/BlockheadActionOutcome_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead action outcome timestamp' : pageSelection.entity.status || 'blockhead action outcome timestamp')} • blockhead action outcome timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead action outcome timestamp'} • blockhead action outcome timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadActionOutcome_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
