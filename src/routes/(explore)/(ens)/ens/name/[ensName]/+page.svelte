<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<Page>
	<EnsNameView
		entityId={{ name: params.ensName }}
		href={resolve('/ens')}
	/>
</Page>
