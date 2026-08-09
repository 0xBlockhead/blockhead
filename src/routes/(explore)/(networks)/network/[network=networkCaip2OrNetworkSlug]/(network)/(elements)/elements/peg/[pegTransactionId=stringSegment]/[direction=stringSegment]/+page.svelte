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

	const pageSelection = $derived(select(EntityType.ElementsPeg, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsPegView from '$/views/ElementsPegView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ([pageSelection.entitySelector.direction, pageSelection.entitySelector.pegTransactionId].filter(Boolean).join(' ') || 'Elements peg')} • Elements peg • Blockhead</title>
</svelte:head>


<Page>
	<ElementsPegView
		selection={pageSelection}
	/>
</Page>
