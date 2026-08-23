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
	import EvmStateChangeView from '$/views/EvmStateChangeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmStateChange, {
					$transaction: data.selector,
					stateChangeKey: decodeURIComponent(params.stateChangeKey),
				}, {
					fields: {
						kind: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'EVM state change' : pageSelection.entity.kind || 'EVM state change')} • EVM state change • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM state change'} • EVM state change • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmStateChange, {
					$transaction: data.selector,
					stateChangeKey: decodeURIComponent(params.stateChangeKey),
				}, {
					fields: {
						kind: true,
					},
				}))}

		<EvmStateChangeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
