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
	import AcpTerminalView from '$/views/AcpTerminalView.svelte'
</script>


<Page>
	<AcpTerminalView
		selection={select(EntityType.AcpTerminal, data.selector)}
	/>
</Page>
