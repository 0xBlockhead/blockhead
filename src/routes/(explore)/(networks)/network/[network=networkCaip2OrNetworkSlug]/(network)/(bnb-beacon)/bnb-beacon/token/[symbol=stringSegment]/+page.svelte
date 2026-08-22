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

	const pageSelection = $derived(select(EntityType.BnbBeaconToken, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconTokenView from '$/views/BnbBeaconTokenView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.symbol || 'bnb beacon token')} • bnb beacon token • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconTokenView
		selection={pageSelection}
	/>
</Page>
