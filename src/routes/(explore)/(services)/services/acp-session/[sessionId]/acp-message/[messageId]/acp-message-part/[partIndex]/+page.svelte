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
	import AcpMessagePartView from '$/views/AcpMessagePartView.svelte'
</script>


<Page>
	<AcpMessagePartView
		selection={select(EntityType.AcpMessagePart, data.selector)}
	/>
</Page>
