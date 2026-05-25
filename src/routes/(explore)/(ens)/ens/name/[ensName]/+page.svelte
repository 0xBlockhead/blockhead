<script lang="ts">
	// Props
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsView from '$/views/EnsView.svelte'
</script>


<Page>
	<EnsView
		entityId={{ name: params.ensName }}
	/>
</Page>
