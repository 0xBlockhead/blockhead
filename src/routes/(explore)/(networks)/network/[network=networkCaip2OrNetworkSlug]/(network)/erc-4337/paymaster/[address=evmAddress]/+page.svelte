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
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Erc4337Paymaster, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 paymaster')} • ERC-4337 paymaster • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ERC-4337 paymaster'} • ERC-4337 paymaster • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.Erc4337Paymaster, data.selector)}

	<Erc4337PaymasterView
		selection={pageSelection}
	/>
	{/if}
</Page>
