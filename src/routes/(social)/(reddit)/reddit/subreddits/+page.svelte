<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<svelte:head>
	<title>Subreddits • Blockhead</title>
</svelte:head>


<Page>
	<RedditSubredditsView
		href={resolve('/(social)/(reddit)/reddit/subreddits')}
		title='Subreddits'
		selection={
			select(EntityType._GlobalRedditNetwork, {
				scope: '_GlobalRedditNetwork',
			})[EntityProxyField]<EntityType.RedditSubreddit>('$$observedSubreddits', {
				sources: [
					Source.Constants_Internal,
					Source.Reddit_PublicJson,
				],
			})
		}
		id='observed-subreddits'
	/>
</Page>
