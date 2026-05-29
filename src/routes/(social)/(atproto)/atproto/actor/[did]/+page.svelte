<script lang="ts">
	// State
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ did: decodeURIComponent(params.did) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoEvmAccountView from '$/views/AtprotoEvmAccountView.svelte'
</script>


<Page>
	<AtprotoEvmAccountView
		{entityId}
	/>
</Page>
