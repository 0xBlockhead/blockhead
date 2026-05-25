<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsResolverView from '$/views/EnsResolverView.svelte'
</script>


<Page>
	<EnsResolverView
		entityId={{ name: params.ensName }}
	/>
</Page>
