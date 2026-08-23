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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconTokenTransferView from '$/views/BnbBeaconTokenTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BnbBeaconTokenTransfer, {
				$transaction: data.selector,
				transferIndex: Number(params.transferIndex),
			}, {
				fields: {
					symbol: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'bnb beacon token transfer' : pageSelection.entity.symbol || 'bnb beacon token transfer')} • bnb beacon token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bnb beacon token transfer'} • bnb beacon token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BnbBeaconTokenTransfer, {
				$transaction: data.selector,
				transferIndex: Number(params.transferIndex),
			}, {
				fields: {
					symbol: true,
				},
			})}

	<BnbBeaconTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
