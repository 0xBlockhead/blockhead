<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.LensNetwork,
			entityId: { scope: 'LensNetwork' },
			fieldName: '$$lensPosts',
		}}
		id="lens-posts"
		title="Publications"
	/>
</Page>
