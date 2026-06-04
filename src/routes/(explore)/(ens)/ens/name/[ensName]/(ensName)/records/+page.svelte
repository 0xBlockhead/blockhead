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
		entityId={{ name: params.ensName }}
	/>
</Page>
