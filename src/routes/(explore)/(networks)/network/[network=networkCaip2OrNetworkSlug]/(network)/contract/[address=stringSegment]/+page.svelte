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

	const pageSelection = $derived(select(EntityType.TronContract, data.selector, {
		sources: [
			Source.TronScan_Rest,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TronContractView from '$/views/TronContractView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'tron contract' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.address || 'tron contract')} • tron contract • Blockhead</title>
</svelte:head>


<Page>
	<TronContractView
		selection={pageSelection}
	/>
</Page>
