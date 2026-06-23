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
	import StarknetStorageEntry_TimestampView from '$/views/StarknetStorageEntry_TimestampView.svelte'
</script>


<Page>
	<StarknetStorageEntry_TimestampView
		selection={select(EntityType.StarknetStorageEntry_Timestamp, data.selector)}
	/>
</Page>
