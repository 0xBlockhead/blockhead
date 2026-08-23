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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandBox, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandBoxView from '$/views/AlgorandBoxView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand box'} • algorand box • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand box'} • algorand box • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandBoxView
		selection={pageSelection}
	/>
	{/if}
</Page>
