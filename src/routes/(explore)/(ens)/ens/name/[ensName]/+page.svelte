<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsView from '$/views/EnsView.svelte'
</script>


<Page>
	<EnsView
		selector={{ name: params.ensName }}
	/>
</Page>
