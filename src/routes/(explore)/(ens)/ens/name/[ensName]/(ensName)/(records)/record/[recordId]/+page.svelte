<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'

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
		href={resolve(`/ens/name/${params.ensName}/record/${params.recordId}`)}
	/>
</Page>
