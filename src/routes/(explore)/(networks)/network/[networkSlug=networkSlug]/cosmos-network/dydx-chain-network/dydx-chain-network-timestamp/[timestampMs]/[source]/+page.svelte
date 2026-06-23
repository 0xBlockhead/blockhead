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
	import DydxChainNetwork_TimestampView from '$/views/DydxChainNetwork_TimestampView.svelte'
</script>


<Page>
	<DydxChainNetwork_TimestampView
		selection={select(EntityType.DydxChainNetwork_Timestamp, data.selector)}
	/>
</Page>
