<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<svelte:head>
	<title>X posts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.XNetwork, {
		scope: 'XNetwork',
	}).$$xPosts}

	<XPostsView
		href={resolve('/(social)/(x)/x/(xNetwork)/posts')}
		title='X posts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='x-posts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
