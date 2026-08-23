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
	import AlgorandApplicationView from '$/views/AlgorandApplicationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandApplication, data.selector)}
		<title>{data?.title ?? (String(pageSelection.entitySelector.applicationId) || 'algorand application')} • algorand application • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand application'} • algorand application • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandApplication, data.selector)}

	<AlgorandApplicationView
		selection={pageSelection}
	/>
	{/if}
</Page>
