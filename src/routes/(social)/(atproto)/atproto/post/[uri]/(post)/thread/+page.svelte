<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import AtprotoPostThreadView from '$/views/AtprotoPostThreadView.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
	<AtprotoPostThreadView
		entityFieldReference={{
			entityType: EntityType.AtprotoPost,
			entityId: {
				uri: decodeURIComponent(params.uri),
			},
			fieldName: '$$thread',
		}}
		id="atproto-post-thread"
		title="Thread"
	/>
</Page>
