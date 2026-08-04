<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
</script>


<svelte:head>
	<title>Wallet connections • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadWalletConnections',
	})
		.$$blockheadWalletConnections({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadWalletConnectionsView
		href={resolve('/~/wallets/connections')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-wallet-connections'
	/>
</Page>
