<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
</script>


<Page>
	<EnsNameTextRecordsView
		selector={{ name: params.ensName }}
	/>
</Page>
