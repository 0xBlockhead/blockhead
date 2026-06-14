<script lang="ts">
	// State
	let {
		data,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<Page>
	<EvmBlobView
		selector={data.entitySelector}
	/>
</Page>
