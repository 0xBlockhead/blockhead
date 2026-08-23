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
	import OracleFeed_RoundView from '$/views/OracleFeed_RoundView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OracleFeed_Round, {
					$oracleFeed: data.selector,
					roundId: BigInt(params.roundId),
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.roundId) || 'oracle feed round')} • oracle feed round • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'oracle feed round'} • oracle feed round • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.OracleFeed_Round, {
					$oracleFeed: data.selector,
					roundId: BigInt(params.roundId),
				}))}

		<OracleFeed_RoundView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
