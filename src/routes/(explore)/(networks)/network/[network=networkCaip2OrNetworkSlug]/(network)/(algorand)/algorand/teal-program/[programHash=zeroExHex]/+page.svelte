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


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandTealProgramView from '$/views/AlgorandTealProgramView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandTealProgram, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.programHash || 'algorand teal program')} • algorand teal program • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand teal program'} • algorand teal program • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandTealProgram, data.selector)}

	<AlgorandTealProgramView
		selection={pageSelection}
	/>
	{/if}
</Page>
