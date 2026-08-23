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
	import BlockheadTransferRequestView from '$/views/BlockheadTransferRequestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadTransferRequest, {
					id: params.id,
					$network: data.selector,
				}, {
					sources: [
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.id || 'blockhead transfer request')} • blockhead transfer request • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead transfer request'} • blockhead transfer request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadTransferRequest, {
					id: params.id,
					$network: data.selector,
				}, {
					sources: [
						Source.Local_Internal,
					],
				}))}

		<BlockheadTransferRequestView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
