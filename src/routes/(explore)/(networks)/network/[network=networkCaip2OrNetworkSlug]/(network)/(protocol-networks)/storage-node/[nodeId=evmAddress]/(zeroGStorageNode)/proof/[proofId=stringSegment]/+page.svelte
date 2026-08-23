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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGStorageProofView from '$/views/ZeroGStorageProofView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGStorageProof, {
					$storageNode: data.selector,
					proofId: params.proofId,
				}, {
					sources: [
						Source.ZeroGStorageScan_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.proofId || 'zero g storage proof')} • zero g storage proof • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'zero g storage proof'} • zero g storage proof • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGStorageProof, {
					$storageNode: data.selector,
					proofId: params.proofId,
				}, {
					sources: [
						Source.ZeroGStorageScan_Rest,
					],
				}))}

		<ZeroGStorageProofView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
