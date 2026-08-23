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
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EigenLayerOperator, data.selector, {
					sources: [
						Source.EigenExplorer_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.operatorAddress || 'eigen layer operator')} • eigen layer operator • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'eigen layer operator'} • eigen layer operator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EigenLayerOperator, data.selector, {
					sources: [
						Source.EigenExplorer_Rest,
					],
				}))}

		<EigenLayerOperatorView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
