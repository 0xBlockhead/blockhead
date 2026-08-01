<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<svelte:head>
	<title>Subreddits • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalRedditNetwork, {
		scope: '_GlobalRedditNetwork',
	}).$$observedSubreddits}

	<RedditSubredditsView
		href={resolve('/(social)/(reddit)/reddit/(globalRedditNetwork)/subreddits')}
		title='Subreddits'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-subreddits'
	/>
</Page>
