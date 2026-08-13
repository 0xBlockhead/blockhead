<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadSourceEndpoint, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Local_Internal,
		],
		fields: {
			endpointUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourceEndpointView from '$/views/BlockheadSourceEndpointView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'source endpoint' : pageSelection.entity.endpointUrl || 'source endpoint')} • source endpoint • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSourceEndpointView
		selection={pageSelection}
	/>
</Page>
