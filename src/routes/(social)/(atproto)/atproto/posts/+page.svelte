<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<Page>
	<AtprotoPostsView
		href={resolve('/atproto/posts')}
		entityFieldReference={{
			entityType: EntityType.AtprotoNetwork,
			selector: { scope: 'AtprotoNetwork' },
			fieldName: '$$atprotoPosts',
		}}
		id="atproto-posts"
		title="Posts"
	/>
</Page>
