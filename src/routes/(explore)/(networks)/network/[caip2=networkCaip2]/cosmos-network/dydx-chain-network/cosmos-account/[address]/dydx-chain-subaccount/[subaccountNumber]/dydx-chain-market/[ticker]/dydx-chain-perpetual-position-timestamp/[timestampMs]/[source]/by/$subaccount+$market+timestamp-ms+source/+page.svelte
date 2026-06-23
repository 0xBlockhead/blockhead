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
	import DydxChainPerpetualPosition_TimestampView from '$/views/DydxChainPerpetualPosition_TimestampView.svelte'
</script>


<Page>
	<DydxChainPerpetualPosition_TimestampView
		selection={select(EntityType.DydxChainPerpetualPosition_Timestamp, data.selector)}
	/>
</Page>
