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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalEvmAbiCatalog, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEvmAbiCatalogView from '$/views/_GlobalEvmAbiCatalogView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'global EVM ABI catalog'} • global EVM ABI catalog • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global EVM ABI catalog'} • global EVM ABI catalog • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalEvmAbiCatalogView
		selection={pageSelection}
	/>
	{/if}
</Page>
