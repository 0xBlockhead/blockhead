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
	import TonContractGetMethod_TimestampView from '$/views/TonContractGetMethod_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonContractGetMethod_Timestamp, {
				$method: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'TON contract get method timestamp'} • TON contract get method timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON contract get method timestamp'} • TON contract get method timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonContractGetMethod_Timestamp, {
				$method: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<TonContractGetMethod_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
