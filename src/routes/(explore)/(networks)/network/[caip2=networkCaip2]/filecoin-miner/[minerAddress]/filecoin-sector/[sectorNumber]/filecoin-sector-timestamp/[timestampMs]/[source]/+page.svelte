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
	import FilecoinSector_TimestampView from '$/views/FilecoinSector_TimestampView.svelte'
</script>


<Page>
	<FilecoinSector_TimestampView
		selection={select(EntityType.FilecoinSector_Timestamp, data.selector)}
	/>
</Page>
