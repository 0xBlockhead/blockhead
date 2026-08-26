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
	import BlockheadWalletsView from '$/views/BlockheadWalletsView.svelte'
</script>


<svelte:head>
	<title>Wallets • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadWallets',
	})
		.$$blockheadWallets({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadWalletsView
		href={resolve('/~/wallets')}
		title='Wallets'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-wallets'
	/>
</Page>
