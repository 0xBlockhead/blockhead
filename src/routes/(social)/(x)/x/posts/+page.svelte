<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<XPostsView
		entityFieldReference={{
			entityType: EntityType.XNetwork,
			entityId: { scope: 'XNetwork' },
			fieldName: '$$xPosts',
		}}
		href={resolve('/x/posts')}
		id="x-posts"
	/>
</Page>
