<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<Page>
	<RedditLinksView
		entityFieldReference={{
			entityType: EntityType.RedditNetwork,
			entityId: { scope: 'RedditNetwork' },
			fieldName: '$$redditLinks',
		}}
		href={resolve('/reddit/links')}
		id="links"
		title="Popular submissions"
	/>
</Page>
