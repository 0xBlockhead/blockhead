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
	import AptosAccountResourceView from '$/views/AptosAccountResourceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AptosAccountResource, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.resourceType || 'aptos account resource')} • aptos account resource • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'aptos account resource'} • aptos account resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AptosAccountResource, data.selector)}

	<AptosAccountResourceView
		selection={pageSelection}
	/>
	{/if}
</Page>
