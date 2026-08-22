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

	const pageSelection = $derived(select(EntityType.Erc4337Paymaster, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 paymaster')} • ERC-4337 paymaster • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337PaymasterView
		selection={pageSelection}
	/>
</Page>
