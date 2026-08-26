<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
