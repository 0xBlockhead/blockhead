<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetTransactionView from '$/views/StarknetTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetTransaction, data.selector, {
					sources: [
						Source.Juno_JsonRpc,
						Source.Pathfinder,
						Source.Starkscan,
						Source.Voyager,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.transactionHash || 'starknet transaction')} • starknet transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'starknet transaction'} • starknet transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetTransaction, data.selector, {
					sources: [
						Source.Juno_JsonRpc,
						Source.Pathfinder,
						Source.Starkscan,
						Source.Voyager,
					],
				}))}

		<StarknetTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
