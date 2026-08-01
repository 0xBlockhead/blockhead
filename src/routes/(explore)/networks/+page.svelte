<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<svelte:head>
	<title>Networks • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$networks',
	})
		.$$networks({
			sources: [
				Source.Constants_Internal,
			],
		})}

	<NetworksView
		href={resolve('/(explore)/networks')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='networks'
	/>
</Page>
