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
	import BlockheadZcashViewingKey_TimestampView from '$/views/BlockheadZcashViewingKey_TimestampView.svelte'
</script>


<Page>
	<BlockheadZcashViewingKey_TimestampView
		selection={select(EntityType.BlockheadZcashViewingKey_Timestamp, data.selector)}
	/>
</Page>
