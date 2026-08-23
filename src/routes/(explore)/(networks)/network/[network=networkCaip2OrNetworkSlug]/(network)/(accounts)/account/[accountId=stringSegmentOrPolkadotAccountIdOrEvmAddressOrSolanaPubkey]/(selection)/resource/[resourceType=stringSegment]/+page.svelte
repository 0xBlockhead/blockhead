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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AptosAccountResource, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosAccountResourceView from '$/views/AptosAccountResourceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.resourceType || 'aptos account resource')} • aptos account resource • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'aptos account resource'} • aptos account resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AptosAccountResourceView
		selection={pageSelection}
	/>
	{/if}
</Page>
