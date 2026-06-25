<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<Page>
	<RedditSubredditsView
		href={resolve('/reddit/subreddits')}
		selection={select(
			EntityType.RedditNetwork,
			{ scope: 'RedditNetwork' }
		).$$redditSubreddits}
		id="subreddits"
	/>
</Page>
