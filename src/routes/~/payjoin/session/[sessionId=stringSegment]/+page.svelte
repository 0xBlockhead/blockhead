<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadPayjoinSession, {
		sessionId: params.sessionId,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPayjoinSessionView from '$/views/BlockheadPayjoinSessionView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.sessionId || 'blockhead payjoin session'} • blockhead payjoin session • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadPayjoinSessionView
		selection={pageSelection}
	/>
</Page>
