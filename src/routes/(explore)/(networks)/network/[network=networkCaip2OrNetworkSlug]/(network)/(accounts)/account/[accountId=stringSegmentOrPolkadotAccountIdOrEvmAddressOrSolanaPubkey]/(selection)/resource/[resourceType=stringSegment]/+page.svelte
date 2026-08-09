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

	const pageSelection = $derived(select(EntityType.AptosAccountResource, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosAccountResourceView from '$/views/AptosAccountResourceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.resourceType || 'aptos account resource')} • aptos account resource • Blockhead</title>
</svelte:head>


<Page>
	<AptosAccountResourceView
		selection={pageSelection}
	/>
</Page>
