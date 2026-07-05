<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBridgeTransactionsView from '$/views/BlockheadBridgeTransactionsView.svelte'
</script>


<svelte:head>
	<title>Transactions • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadBridgeTransactionsView
		href={resolve('/~/accounts/transactions')}
		title='Transactions'
		selection={
			select(EntityType._Global, {
				scope: '$$bridgeTransactions',
			})[EntityProxyField]<EntityType.BlockheadBridgeTransaction>('$$bridgeTransactions', {
				sources: [
					Source.Local_Internal,
				],
			})
		}
		id='bridge-transactions'
	/>
</Page>
