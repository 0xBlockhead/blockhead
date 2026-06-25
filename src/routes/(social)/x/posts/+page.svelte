<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<Page>
	<XPostsView
		href={resolve('/x/posts')}
		selection={select(
			EntityType.XNetwork,
			{ scope: 'XNetwork' }
		).$$xPosts}
		id="x-posts"
	/>
</Page>
