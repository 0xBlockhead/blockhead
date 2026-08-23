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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageTokenTransferView from '$/views/FilecoinMessageTokenTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageTokenTransfer, {
				$message: data.selector,
				index: Number(params.index),
			}, {
				sources: [
					Source.Filfox_Rest,
				],
				fields: {
					tokenSymbol: true,
					token: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message token transfer' : [(pageSelection.entity.tokenSymbol ?? ''), (pageSelection.entity.token ?? '')].filter(Boolean).join(' ') || 'filecoin message token transfer')} • filecoin message token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message token transfer'} • filecoin message token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageTokenTransfer, {
				$message: data.selector,
				index: Number(params.index),
			}, {
				sources: [
					Source.Filfox_Rest,
				],
				fields: {
					tokenSymbol: true,
					token: true,
				},
			})}

	<FilecoinMessageTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
