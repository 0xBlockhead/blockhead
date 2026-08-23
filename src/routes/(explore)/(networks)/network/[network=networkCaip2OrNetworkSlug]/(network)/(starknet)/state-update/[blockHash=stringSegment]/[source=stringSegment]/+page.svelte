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
	import StarknetStateUpdateView from '$/views/StarknetStateUpdateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetStateUpdate, {
					$network: {
						$network: data.selector,
					},
					blockHash: params.blockHash,
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.blockHash || 'Starknet state update')} • Starknet state update • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Starknet state update'} • Starknet state update • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetStateUpdate, {
					$network: {
						$network: data.selector,
					},
					blockHash: params.blockHash,
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<StarknetStateUpdateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
