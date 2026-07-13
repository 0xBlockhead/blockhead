<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'

	const pageSelection = $derived(select(EntityType.YoutubeNetwork, {
		scope: 'YoutubeNetwork',
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.protocolName) ?? '')].filter(Boolean).join(' ') || 'YouTube Data API' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).protocolName) ?? '')].filter(Boolean).join(' ') || 'YouTube Data API'))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeNetworkView from '$/views/YoutubeNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube Data API • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeNetworkView
		href={resolve('/youtube/api')}
		selection={pageSelection}
	/>
</Page>
