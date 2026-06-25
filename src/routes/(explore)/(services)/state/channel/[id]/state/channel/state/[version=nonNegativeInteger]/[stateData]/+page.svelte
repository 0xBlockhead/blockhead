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
	import BlockheadStateChannelStateView from '$/views/BlockheadStateChannelStateView.svelte'
</script>


<Page>
	<BlockheadStateChannelStateView
		selection={select(EntityType.BlockheadStateChannelState, data.selector)}
	/>
</Page>
