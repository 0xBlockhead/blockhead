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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AlgorandApplication, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandApplicationView from '$/views/AlgorandApplicationView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.applicationId) || 'algorand application')} • algorand application • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandApplicationView
		selection={pageSelection}
	/>
</Page>
