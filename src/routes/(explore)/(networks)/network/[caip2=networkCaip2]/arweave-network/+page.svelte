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
	import ArweaveNetworkView from '$/views/ArweaveNetworkView.svelte'
</script>


<Page>
	<ArweaveNetworkView
		selection={select(EntityType.ArweaveNetwork, data.selector)}
	/>
</Page>
