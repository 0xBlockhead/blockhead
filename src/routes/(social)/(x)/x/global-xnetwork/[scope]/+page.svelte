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
	import GlobalXNetworkView from '$/views/_GlobalXNetworkView.svelte'
</script>


<Page>
	<GlobalXNetworkView
		selection={select(EntityType._GlobalXNetwork, data.selector)}
	/>
</Page>
