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
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<Page>
	<GlobalNostrNetworkView
		selection={select(EntityType._GlobalNostrNetwork, data.selector)}
	/>
</Page>
