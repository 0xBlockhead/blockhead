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
	import Page from '$/components/Page.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<Page>
	<AtprotoActorView
		{entityId}
		href={resolve('/(social)/atproto/actor/[did]', {
			did: encodeURIComponent(entityId.did),
		})}
	/>
</Page>
