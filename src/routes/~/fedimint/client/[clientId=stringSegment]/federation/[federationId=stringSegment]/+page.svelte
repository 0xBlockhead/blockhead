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

	const pageSelection = $derived(select(EntityType.BlockheadFedimintClientState, data.selector, {
		fields: {
			clientName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFedimintClientStateView from '$/views/BlockheadFedimintClientStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.clientId ?? '') || 'blockhead Fedimint client state' : (pageSelection.entity.clientName ?? '') || pageSelection.entitySelector.clientId || 'blockhead Fedimint client state')} • blockhead Fedimint client state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadFedimintClientStateView
		selection={pageSelection}
	/>
</Page>
