<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TronContractView from '$/views/TronContractView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TronContract, data.selector, {
				sources: [
					Source.TronScan_Rest,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'tron contract' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.address || 'tron contract')} • tron contract • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tron contract'} • tron contract • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TronContract, data.selector, {
				sources: [
					Source.TronScan_Rest,
				],
				fields: {
					name: true,
				},
			})}

	<TronContractView
		selection={pageSelection}
	/>
	{/if}
</Page>
