<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<Page>
	<LensPostView
		selection={select(EntityType.LensPost, { id: decodeURIComponent(params.postId) })}
	>
	</LensPostView>
</Page>
