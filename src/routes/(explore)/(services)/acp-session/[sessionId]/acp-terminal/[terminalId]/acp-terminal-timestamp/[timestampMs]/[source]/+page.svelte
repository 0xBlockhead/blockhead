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
	import AcpTerminal_TimestampView from '$/views/AcpTerminal_TimestampView.svelte'
</script>


<Page>
	<AcpTerminal_TimestampView
		selection={select(EntityType.AcpTerminal_Timestamp, data.selector)}
	/>
</Page>
