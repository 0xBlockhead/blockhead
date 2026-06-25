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
	import BlockheadTransferIntentView from '$/views/BlockheadTransferIntentView.svelte'
</script>


<Page>
	<BlockheadTransferIntentView
		selection={select(EntityType.BlockheadTransferIntent, data.selector)}
	/>
</Page>
