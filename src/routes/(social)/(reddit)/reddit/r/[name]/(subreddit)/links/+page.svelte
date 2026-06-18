<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<Page>
	<RedditLinksView
		href={resolve('/reddit/links')}
		selection={select(
			EntityType.RedditSubreddit,
			{
				name: decodeURIComponent(params.name).toLowerCase(),
			}
		).$$links}
		id="reddit-subreddit-links"
	/>
</Page>
