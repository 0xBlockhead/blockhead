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
	import BlockheadZeroGStorageProofView from '$/views/BlockheadZeroGStorageProofView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZeroGStorageProof, {
					$nodeState: data.selector,
					proofId: params.proofId,
				}, {
					sources: [
						Source.Local_Internal,
						Source.ZeroGStorageNode_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.proofId || 'blockhead zero g storage proof')} • blockhead zero g storage proof • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead zero g storage proof'} • blockhead zero g storage proof • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadZeroGStorageProof, {
					$nodeState: data.selector,
					proofId: params.proofId,
				}, {
					sources: [
						Source.Local_Internal,
						Source.ZeroGStorageNode_JsonRpc,
					],
				}))}

		<BlockheadZeroGStorageProofView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
