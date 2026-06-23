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
	import EvmError_TimestampView from '$/views/EvmError_TimestampView.svelte'
</script>


<Page>
	<EvmError_TimestampView
		selection={select(EntityType.EvmError_Timestamp, data.selector)}
	/>
</Page>
