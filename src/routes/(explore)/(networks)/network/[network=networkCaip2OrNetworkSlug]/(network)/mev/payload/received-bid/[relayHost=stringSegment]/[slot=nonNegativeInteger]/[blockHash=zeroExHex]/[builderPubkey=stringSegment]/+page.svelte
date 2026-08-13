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

	const pageSelection = $derived(select(EntityType.MevRelay_BuilderBlockReceived, data.selector, {
		fields: {
			valueWei: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_BuilderBlockReceivedView from '$/views/MevRelay_BuilderBlockReceivedView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Slot ' + String(pageSelection.entitySelector.slot ?? '') : ['Slot ' + String(pageSelection.entitySelector.slot), (pageSelection.entity.valueWei != null ? String(pageSelection.entity.valueWei) + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay builder block received')} • MEV relay builder block received • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_BuilderBlockReceivedView
		selection={pageSelection}
	/>
</Page>
