<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
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
	/>
</Page>
