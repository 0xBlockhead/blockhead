<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<svelte:head>
	<title>Popular submissions • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalRedditNetwork, {
		scope: '_GlobalRedditNetwork',
	}).$$observedLinks}

	<RedditLinksView
		href={resolve('/(social)/(reddit)/reddit/(globalRedditNetwork)/links')}
		title='Popular submissions'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-links'
	/>
</Page>
