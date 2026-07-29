<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.RssNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
			registryName: true,
			relationshipModel: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RssNetworkView from '$/views/RssNetworkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'RSS / Atom' : pageSelection.entity.protocolName || 'RSS / Atom')} • RSS / Atom • Blockhead</title>
</svelte:head>


<Page>
	<RssNetworkView
		selection={pageSelection}
	/>
</Page>
