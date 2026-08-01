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

	const pageSelection = $derived(select(EntityType.MevRelay, data.selector, {
		fields: {
			url: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.host || 'MEV relay')} • MEV relay • Blockhead</title>
</svelte:head>


<Page>
	<MevRelayView
		selection={pageSelection}
	/>
</Page>
