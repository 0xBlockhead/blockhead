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
	import BlockheadZcashNoteStateView from '$/views/BlockheadZcashNoteStateView.svelte'
</script>


<Page>
	<BlockheadZcashNoteStateView
		selection={select(EntityType.BlockheadZcashNoteState, data.selector)}
	/>
</Page>
