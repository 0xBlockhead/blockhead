<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


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
		entityId={{ name: params.ensName }}
		href={resolve('/(explore)/(ens)/ens/name/[ensName]', params)}
	/>
</Page>
