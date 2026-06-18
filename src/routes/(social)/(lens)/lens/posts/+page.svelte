<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<Page>
	<LensPostsView
		href={resolve('/lens/posts')}
		selection={select(
			EntityType.LensNetwork,
			{ scope: 'LensNetwork' }
		).$$lensPosts}
		id="lens-posts"
		title="Publications"
	/>
</Page>
