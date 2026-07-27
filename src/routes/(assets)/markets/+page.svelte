<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<svelte:head>
	<title>Markets • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$markets',
	}).$$markets}

	<MarketsView
		href={resolve('/(assets)/markets')}
		title='Markets'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='markets'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
