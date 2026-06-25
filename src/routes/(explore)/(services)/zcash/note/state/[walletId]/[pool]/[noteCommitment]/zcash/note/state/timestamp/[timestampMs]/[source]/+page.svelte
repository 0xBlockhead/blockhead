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
	import BlockheadZcashNoteState_TimestampView from '$/views/BlockheadZcashNoteState_TimestampView.svelte'
</script>


<Page>
	<BlockheadZcashNoteState_TimestampView
		selection={select(EntityType.BlockheadZcashNoteState_Timestamp, data.selector)}
	/>
</Page>
