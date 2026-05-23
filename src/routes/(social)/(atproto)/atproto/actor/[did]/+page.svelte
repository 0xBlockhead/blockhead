<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// Props
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ did: decodeURIComponent(params.did) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<Page>
	<AtprotoActorView
		{entityId}
		href={resolve('/(social)/(atproto)/atproto/actor/[did]', {
			did: encodeURIComponent(entityId.did),
		})}
	/>
</Page>
