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

	const pageSelection = $derived(select(EntityType.Erc4337AccountFactory, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.address || 'ERC-4337 account factory')} • ERC-4337 account factory • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337AccountFactoryView
		selection={pageSelection}
	/>
</Page>
