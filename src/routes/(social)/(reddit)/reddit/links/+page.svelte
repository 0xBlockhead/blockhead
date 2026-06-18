<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<Page>
	<RedditLinksView
		href={resolve('/reddit/links')}
		selection={select(
			EntityType.RedditNetwork,
			{ scope: 'RedditNetwork' }
		).$$redditLinks}
		id="links"
		title="Popular submissions"
	/>
</Page>
