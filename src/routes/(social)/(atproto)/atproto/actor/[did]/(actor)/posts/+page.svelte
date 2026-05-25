<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ did: decodeURIComponent(params.did) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<Page>
	<AtprotoPostsView
		href={resolve(
			'/(social)/(atproto)/atproto/actor/[did]/(actor)/posts',
			{ did: encodeURIComponent(entityId.did) },
		)}
		entityFieldReference={{
			entityType: EntityType.AtprotoActor,
			entityId,
			fieldName: '$$posts',
		}}
		id="atproto-actor-posts"
	/>
</Page>
