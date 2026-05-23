<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// Props
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
		href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', params)}
	/>
</Page>
