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
	import StellarOperationView from '$/views/StellarOperationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarOperation, {
				$transaction: data.selector,
				operationIndex: Number(params.operationIndex),
			})}
		<title>{data?.title ?? 'stellar operation'} • stellar operation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar operation'} • stellar operation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarOperation, {
				$transaction: data.selector,
				operationIndex: Number(params.operationIndex),
			})}

	<StellarOperationView
		selection={pageSelection}
	/>
	{/if}
</Page>
