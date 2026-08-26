<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select

	const pageSelection = $derived(select(EntityType.YoutubeNetwork, {
		scope: 'YoutubeNetwork',
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
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
