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
	import TransferRestrictionCheck_TimestampView from '$/views/TransferRestrictionCheck_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TransferRestrictionCheck_Timestamp, {
				$restriction: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
				subjectKey: params.subjectKey,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'transfer restriction check timestamp'} • transfer restriction check timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'transfer restriction check timestamp'} • transfer restriction check timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TransferRestrictionCheck_Timestamp, {
				$restriction: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
				subjectKey: params.subjectKey,
			}, {
				sources: [params.source],
			})}

	<TransferRestrictionCheck_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
