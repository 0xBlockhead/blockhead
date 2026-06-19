<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<Page>
	<RedditSubredditView
		selection={select(EntityType.RedditSubreddit, { name: decodeURIComponent(params.name).toLowerCase() })}
	>
	</RedditSubredditView>
</Page>
