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

	const pageSelection = $derived(select(EntityType.AlgorandTealProgram, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandTealProgramView from '$/views/AlgorandTealProgramView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.programHash || 'algorand teal program')} • algorand teal program • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandTealProgramView
		selection={pageSelection}
	/>
</Page>
