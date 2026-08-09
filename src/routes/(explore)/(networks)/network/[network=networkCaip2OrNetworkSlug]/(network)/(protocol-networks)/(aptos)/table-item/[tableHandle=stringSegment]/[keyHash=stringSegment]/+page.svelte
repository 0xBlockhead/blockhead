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

	const pageSelection = $derived(select(EntityType.AptosTableItem, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosTableItemView from '$/views/AptosTableItemView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.keyHash || 'aptos table item')} • aptos table item • Blockhead</title>
</svelte:head>


<Page>
	<AptosTableItemView
		selection={pageSelection}
	/>
</Page>
