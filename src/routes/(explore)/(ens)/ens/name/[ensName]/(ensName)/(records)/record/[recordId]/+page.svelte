<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsTextRecordView from '$/views/EnsTextRecordView.svelte'
</script>


<Page>
	<EnsTextRecordView
		selector={{ name: params.ensName }}
		recordId={params.recordId}
	/>
</Page>
