<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsResolvesToView from '$/views/EnsResolvesToView.svelte'
</script>


<Page>
	<EnsResolvesToView
		entityId={{ name: params.ensName }}
		href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', params)}
	/>
</Page>
