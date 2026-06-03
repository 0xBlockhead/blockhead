<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<Page>
	<AtprotoActorView
		entityId={{ did: decodeURIComponent(params.did) }}
	/>
</Page>
