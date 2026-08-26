<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAccountsView from '$/views/BlockheadAccountsView.svelte'
</script>


<svelte:head>
	<title>Accounts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadAccounts',
	})
		.$$blockheadAccounts({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadAccountsView
		href={resolve('/~/accounts')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-accounts'
	/>
</Page>
