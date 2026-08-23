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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TronWitness, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TronWitnessView from '$/views/TronWitnessView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tron witness'} • tron witness • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tron witness'} • tron witness • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TronWitnessView
		selection={pageSelection}
	/>
	{/if}
</Page>
