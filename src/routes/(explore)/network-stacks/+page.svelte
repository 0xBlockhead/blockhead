<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkStacksView from '$/views/NetworkStacksView.svelte'
</script>


<svelte:head>
	<title>Network stacks • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$networkStacks',
	})
		.$$networkStacks({
			sources: [
				Source.Constants_Internal,
			],
		})}

	<NetworkStacksView
		href={resolve('/(explore)/network-stacks')}
		title='Network stacks'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='network-stacks'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
