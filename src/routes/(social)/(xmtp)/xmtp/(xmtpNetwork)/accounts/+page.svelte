<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
</script>


<svelte:head>
	<title>XMTP accounts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$actors',
	}).$$actors}

	<EvmAccountsView
		href={resolve('/(social)/(xmtp)/xmtp/(xmtpNetwork)/accounts')}
		title='XMTP accounts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='actors'
	/>
</Page>
