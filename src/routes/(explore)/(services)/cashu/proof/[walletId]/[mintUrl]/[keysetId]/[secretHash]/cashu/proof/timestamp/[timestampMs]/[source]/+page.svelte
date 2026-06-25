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
	import BlockheadCashuProof_TimestampView from '$/views/BlockheadCashuProof_TimestampView.svelte'
</script>


<Page>
	<BlockheadCashuProof_TimestampView
		selection={select(EntityType.BlockheadCashuProof_Timestamp, data.selector)}
	/>
</Page>
