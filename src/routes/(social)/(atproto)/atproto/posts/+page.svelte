<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType.AtprotoNetwork,
			{ scope: 'AtprotoNetwork' }
		).$$atprotoPosts}
		id="atproto-posts"
		title="Posts"
	/>
</Page>
