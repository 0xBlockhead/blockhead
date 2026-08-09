<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'

	const pageSelection = $derived(select(EntityType.ActivityPubNetwork, {
		scope: 'ActivityPubNetwork',
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
	import ActivityPubNetworkView from '$/views/ActivityPubNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'ActivityPub' : pageSelection.entity.protocolName || 'ActivityPub'} • ActivityPub • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNetworkView
		selection={pageSelection}
	/>
</Page>
