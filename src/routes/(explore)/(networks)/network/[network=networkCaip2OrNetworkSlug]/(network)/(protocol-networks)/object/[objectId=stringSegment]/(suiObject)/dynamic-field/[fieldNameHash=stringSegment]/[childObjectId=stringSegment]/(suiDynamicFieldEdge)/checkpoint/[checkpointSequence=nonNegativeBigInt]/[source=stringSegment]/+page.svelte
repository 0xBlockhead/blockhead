<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SuiDynamicFieldEdge_TimestampView from '$/views/SuiDynamicFieldEdge_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SuiDynamicFieldEdge_Timestamp, {
					$edge: data.selector,
					checkpointSequence: BigInt(params.checkpointSequence),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'Sui dynamic field edge timestamp'} • Sui dynamic field edge timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Sui dynamic field edge timestamp'} • Sui dynamic field edge timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SuiDynamicFieldEdge_Timestamp, {
					$edge: data.selector,
					checkpointSequence: BigInt(params.checkpointSequence),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<SuiDynamicFieldEdge_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
