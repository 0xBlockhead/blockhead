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
	import BlockheadQuilibriumAccountState_TimestampView from '$/views/BlockheadQuilibriumAccountState_TimestampView.svelte'
</script>


<Page>
	<BlockheadQuilibriumAccountState_TimestampView
		selection={select(EntityType.BlockheadQuilibriumAccountState_Timestamp, data.selector)}
	/>
</Page>
