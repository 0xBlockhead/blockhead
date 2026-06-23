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
	import AtprotoNetworkView from '$/views/AtprotoNetworkView.svelte'
</script>


<Page>
	<AtprotoNetworkView
		selection={select(EntityType.AtprotoNetwork, data.selector)}
	/>
</Page>
