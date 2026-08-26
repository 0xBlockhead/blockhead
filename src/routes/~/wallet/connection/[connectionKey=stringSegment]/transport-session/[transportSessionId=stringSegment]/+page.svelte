<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadWalletTransportSession, {
		connectionKey: params.connectionKey,
		transportSessionId: params.transportSessionId,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletTransportSessionView from '$/views/BlockheadWalletTransportSessionView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.transportSessionId || 'blockhead wallet transport session'} • blockhead wallet transport session • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletTransportSessionView
		selection={pageSelection}
	/>
</Page>
