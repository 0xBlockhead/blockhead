<script lang="ts">
	// State
	let {
		data,
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<Page>
	<EvmBlobView
		entityId={data.entityId}
	/>
</Page>
