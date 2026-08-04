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
	import BlockheadWalletRequestsView from '$/views/BlockheadWalletRequestsView.svelte'
</script>


<svelte:head>
	<title>Wallet requests • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadWalletRequests',
	})
		.$$blockheadWalletRequests({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadWalletRequestsView
		href={resolve('/~/wallets/requests')}
		title='Wallet requests'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-wallet-requests'
	/>
</Page>
