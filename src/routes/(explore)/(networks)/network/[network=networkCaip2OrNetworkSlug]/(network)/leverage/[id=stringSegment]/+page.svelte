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
	import LeverageView from '$/views/LeverageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Leverage, {
					$network: data.selector,
					id: params.id,
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.id || 'leverage')} • leverage • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'leverage'} • leverage • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Leverage, {
					$network: data.selector,
					id: params.id,
				}))}

		<LeverageView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
