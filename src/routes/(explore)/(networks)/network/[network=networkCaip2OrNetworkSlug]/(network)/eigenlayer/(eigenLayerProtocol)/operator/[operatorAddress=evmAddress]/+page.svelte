<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EigenLayerOperator, data.selector, {
		sources: [
			Source.EigenExplorer_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.operatorAddress || 'eigen layer operator')} • eigen layer operator • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer operator'} • eigen layer operator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EigenLayerOperatorView
		selection={pageSelection}
	/>
	{/if}
</Page>
