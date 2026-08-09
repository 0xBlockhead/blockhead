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

	const pageSelection = $derived(select(EntityType.PayjoinEndpoint, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.endpointUrl || 'payjoin endpoint')} • payjoin endpoint • Blockhead</title>
</svelte:head>


<Page>
	<PayjoinEndpointView
		selection={pageSelection}
	/>
</Page>
