<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotPallet, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.palletName || 'Polkadot pallet')} • Polkadot pallet • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot pallet'} • Polkadot pallet • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PolkadotPalletView
		selection={pageSelection}
	/>
	{/if}
</Page>
