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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PolkadotPallet, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.palletName || 'Polkadot pallet')} • Polkadot pallet • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot pallet'} • Polkadot pallet • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PolkadotPallet, data.selector)}

	<PolkadotPalletView
		selection={pageSelection}
	/>
	{/if}
</Page>
