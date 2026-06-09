<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.RedditNetwork,
			entityId: { scope: 'RedditNetwork' },
			fieldName: '$$redditLinks',
		}}
		id="links"
		title="Popular submissions"
	/>
</Page>
