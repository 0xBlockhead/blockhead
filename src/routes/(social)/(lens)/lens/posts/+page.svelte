<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<LensPostsView
		entityFieldReference={{
			entityType: EntityType.LensNetwork,
			entityId: { scope: 'LensNetwork' },
			fieldName: '$$lensPosts',
		}}
		href={resolve('/lens/posts')}
		id="lens-posts"
		title="Posts"
	/>
</Page>
