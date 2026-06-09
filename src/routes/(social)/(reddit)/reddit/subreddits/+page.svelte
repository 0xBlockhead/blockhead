<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.RedditNetwork,
			entityId: { scope: 'RedditNetwork' },
			fieldName: '$$redditSubreddits',
		}}
		id="subreddits"
	/>
</Page>
