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
	import GlobalRssNetworkView from '$/views/_GlobalRssNetworkView.svelte'
</script>


<Page>
	<GlobalRssNetworkView
		selection={select(EntityType._GlobalRssNetwork, data.selector)}
	/>
</Page>
