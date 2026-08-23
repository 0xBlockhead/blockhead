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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmBlob, data.selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.Blobscan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Blob #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM blob')} • EVM blob • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM blob'} • EVM blob • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmBlobView
		selection={pageSelection}
	/>
	{/if}
</Page>
