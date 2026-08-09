<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'

	const pageSelection = $derived(select(EntityType.RedditNetwork, {
		scope: 'RedditNetwork',
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
	import RedditNetworkView from '$/views/RedditNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Reddit network' : pageSelection.entity.protocolName || 'Reddit network'} • Reddit network • Blockhead</title>
</svelte:head>


<Page>
	<RedditNetworkView
		selection={pageSelection}
	/>
</Page>
