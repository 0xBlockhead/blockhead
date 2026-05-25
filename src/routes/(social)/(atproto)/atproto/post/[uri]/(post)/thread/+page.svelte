<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived({
		uri: decodeURIComponent(params.uri),
	})


	// Components
	import AtprotoPostThreadView from '$/views/AtprotoPostThreadView.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<AtprotoPostThreadView
		entityFieldReference={{
			entityType: EntityType.AtprotoPost,
			entityId,
			fieldName: '$$thread',
		}}
		id="atproto-post-thread"
		title="Thread"
	/>
</Page>
