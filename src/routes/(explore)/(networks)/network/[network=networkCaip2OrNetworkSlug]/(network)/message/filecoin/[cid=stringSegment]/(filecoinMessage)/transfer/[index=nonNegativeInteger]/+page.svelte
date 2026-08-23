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
	import FilecoinMessageTransferView from '$/views/FilecoinMessageTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinMessageTransfer, {
					$message: data.selector,
					index: Number(params.index),
				}, {
					sources: [
						Source.Filfox_Rest,
					],
					fields: {
						transferType: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message transfer' : pageSelection.entity.transferType || 'filecoin message transfer')} • filecoin message transfer • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'filecoin message transfer'} • filecoin message transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinMessageTransfer, {
					$message: data.selector,
					index: Number(params.index),
				}, {
					sources: [
						Source.Filfox_Rest,
					],
					fields: {
						transferType: true,
					},
				}))}

		<FilecoinMessageTransferView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
