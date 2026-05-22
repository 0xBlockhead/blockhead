<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<Page>
	<RedditSubredditsView
		entityFieldReference={{
			entityType: EntityType.RedditNetwork,
			entityId: { scope: 'RedditNetwork' },
			fieldName: '$$redditSubreddits',
		}}
		href={resolve('/reddit/subreddits')}
		id="subreddits"
	/>
</Page>
