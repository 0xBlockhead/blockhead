<script lang="ts">
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
	/>
</Page>
