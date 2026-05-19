<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


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
		entityId={{ name: params.ensName }}
		href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/(records)/record/[recordId]', params)}
		recordId={params.recordId}
	/>
</Page>
