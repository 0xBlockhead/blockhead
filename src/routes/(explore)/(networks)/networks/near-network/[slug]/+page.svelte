<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NearNetworkView from '$/views/NearNetworkView.svelte'
</script>


<Page>
	<NearNetworkView
		selection={select(EntityType.NearNetwork, data.selector)}
	/>
</Page>
