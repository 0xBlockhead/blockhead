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

	const pageSelection = $derived(select(EntityType.IbcClient, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcClientView from '$/views/IbcClientView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.clientId || 'IBC client')} • IBC client • Blockhead</title>
</svelte:head>


<Page>
	<IbcClientView
		selection={pageSelection}
	/>
</Page>
