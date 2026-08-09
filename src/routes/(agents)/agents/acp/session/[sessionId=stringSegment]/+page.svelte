<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AcpSession, data.selector, {
		sources: [
			Source.AcpLocal_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.sessionId || 'ACP session')} • ACP session • Blockhead</title>
</svelte:head>


<Page>
	<AcpSessionView
		selection={pageSelection}
	/>
</Page>
