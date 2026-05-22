<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<AtprotoPostsView
		entityFieldReference={{
			entityType: EntityType.AtprotoNetwork,
			entityId: { scope: 'AtprotoNetwork' },
			fieldName: '$$atprotoPosts',
		}}
		href={resolve('/atproto/posts')}
		id="atproto-posts"
		title="Posts"
	/>
</Page>
