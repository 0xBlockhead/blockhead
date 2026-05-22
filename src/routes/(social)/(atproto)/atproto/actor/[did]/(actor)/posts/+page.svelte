<script lang="ts">
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
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<AtprotoPostsView
		entityFieldReference={{
			entityType: EntityType.AtprotoActor,
			entityId,
			fieldName: '$$posts',
		}}
		href={resolve('/(social)/(atproto)/atproto/actor/[did]/(actor)/posts', {
			did: encodeURIComponent(entityId.did),
		})}
		id="atproto-actor-posts"
	/>
</Page>
