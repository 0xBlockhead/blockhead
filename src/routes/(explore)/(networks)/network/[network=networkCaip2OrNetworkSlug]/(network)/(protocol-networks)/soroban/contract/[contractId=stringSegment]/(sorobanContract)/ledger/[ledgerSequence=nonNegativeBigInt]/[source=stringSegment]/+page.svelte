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
	import SorobanContract_TimestampView from '$/views/SorobanContract_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SorobanContract_Timestamp, {
					$contract: data.selector,
					ledgerSequence: BigInt(params.ledgerSequence),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'soroban contract timestamp'} • soroban contract timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'soroban contract timestamp'} • soroban contract timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SorobanContract_Timestamp, {
					$contract: data.selector,
					ledgerSequence: BigInt(params.ledgerSequence),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<SorobanContract_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
