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

	const pageSelection = $derived(select(EntityType.CctpAllowance, data.selector, {
		sources: [
			Source.CircleCctpIris,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CctpAllowanceView from '$/views/CctpAllowanceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.token || 'CCTP allowance')} • CCTP allowance • Blockhead</title>
</svelte:head>


<Page>
	<CctpAllowanceView
		selection={pageSelection}
	/>
</Page>
