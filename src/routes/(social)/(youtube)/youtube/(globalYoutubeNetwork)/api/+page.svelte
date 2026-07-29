<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
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


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeNetworkView from '$/views/YoutubeNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'YouTube Data API' : pageSelection.entity.protocolName || 'YouTube Data API'} • YouTube Data API • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeNetworkView
		selection={pageSelection}
	/>
</Page>
