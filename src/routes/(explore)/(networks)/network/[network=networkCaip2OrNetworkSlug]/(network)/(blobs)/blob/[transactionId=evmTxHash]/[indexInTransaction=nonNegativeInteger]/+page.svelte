<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmBlob, data.selector, {
					sources: [
						Source.Voltaire_JsonRpc,
						Source.Blobscan_Rest,
					],
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Blob #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM blob')} • EVM blob • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM blob'} • EVM blob • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmBlob, data.selector, {
					sources: [
						Source.Voltaire_JsonRpc,
						Source.Blobscan_Rest,
					],
				}))}

		<EvmBlobView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
