<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<Page>
	<XPostView
		selection={select(EntityType.XPost, { id: decodeURIComponent(params.postId) })}
	>
	</XPostView>
</Page>
