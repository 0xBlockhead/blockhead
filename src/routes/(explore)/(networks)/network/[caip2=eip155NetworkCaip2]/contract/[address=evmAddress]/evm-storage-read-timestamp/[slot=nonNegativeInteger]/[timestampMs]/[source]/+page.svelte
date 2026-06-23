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
	import EvmStorageRead_TimestampView from '$/views/EvmStorageRead_TimestampView.svelte'
</script>


<Page>
	<EvmStorageRead_TimestampView
		selection={select(EntityType.EvmStorageRead_Timestamp, data.selector)}
	/>
</Page>
