<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.XNetwork,
			entityId: { scope: 'XNetwork' },
			fieldName: '$$xPosts',
		}}
		id="x-posts"
	/>
</Page>
