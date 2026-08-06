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

	const pageSelection = $derived(select(EntityType.IbcConnection, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcConnectionView from '$/views/IbcConnectionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.connectionId || 'IBC connection')} • IBC connection • Blockhead</title>
</svelte:head>


<Page>
	<IbcConnectionView
		selection={pageSelection}
	/>
</Page>
