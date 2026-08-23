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
	import AlgorandTealProgram_TimestampView from '$/views/AlgorandTealProgram_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandTealProgram_Timestamp, {
					$program: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'algorand teal program timestamp'} • algorand teal program timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'algorand teal program timestamp'} • algorand teal program timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandTealProgram_Timestamp, {
					$program: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<AlgorandTealProgram_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
