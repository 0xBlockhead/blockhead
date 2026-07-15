<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.protocolName) ?? '')].filter(Boolean).join(' ') || 'RSS / Atom' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).protocolName) ?? '')].filter(Boolean).join(' ') || 'RSS / Atom')))


	// Components
	import Page from '$/components/Page.svelte'
	import RssNetworkView from '$/views/RssNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • RSS / Atom • Blockhead</title>
</svelte:head>


<Page>
	<RssNetworkView
		href={resolve('/rss')}
		selection={pageSelection}
	/>
</Page>
