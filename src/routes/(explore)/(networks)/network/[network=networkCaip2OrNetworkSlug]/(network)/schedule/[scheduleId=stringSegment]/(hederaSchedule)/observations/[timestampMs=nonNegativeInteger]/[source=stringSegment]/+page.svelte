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
	import HederaSchedule_TimestampView from '$/views/HederaSchedule_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaSchedule_Timestamp, {
				$schedule: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'hedera schedule timestamp'} • hedera schedule timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera schedule timestamp'} • hedera schedule timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaSchedule_Timestamp, {
				$schedule: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<HederaSchedule_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
