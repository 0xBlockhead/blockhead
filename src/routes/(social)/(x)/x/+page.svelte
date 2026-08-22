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

	const pageSelection = $derived(select(EntityType.XNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XNetworkView from '$/views/XNetworkView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'X' : pageSelection.entity.protocolName || 'X')} • X • Blockhead</title>
</svelte:head>


<Page>
	<XNetworkView
		selection={pageSelection}
	/>
</Page>
