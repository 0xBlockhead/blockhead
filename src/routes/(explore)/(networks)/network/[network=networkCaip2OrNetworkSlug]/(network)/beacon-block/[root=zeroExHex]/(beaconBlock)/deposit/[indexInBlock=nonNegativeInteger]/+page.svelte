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
	import BeaconDepositView from '$/views/BeaconDepositView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconDeposit, {
				$block: data.selector,
				indexInBlock: Number(params.indexInBlock),
			}, {
				fields: {
					pubkey: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? `Deposit #${pageSelection.entitySelector.indexInBlock}` : (String(pageSelection.entitySelector.indexInBlock ?? '') ? 'Deposit #' + String(pageSelection.entitySelector.indexInBlock ?? '') : '') || 'beacon deposit')} • beacon deposit • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'beacon deposit'} • beacon deposit • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconDeposit, {
				$block: data.selector,
				indexInBlock: Number(params.indexInBlock),
			}, {
				fields: {
					pubkey: true,
				},
			})}

	<BeaconDepositView
		selection={pageSelection}
	/>
	{/if}
</Page>
