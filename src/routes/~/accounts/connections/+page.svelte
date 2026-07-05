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
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
</script>


<svelte:head>
	<title>Wallet connections • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletConnectionsView
		href={resolve('/~/accounts/connections')}
		title='Wallet connections'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadWalletConnections',
			})[EntityProxyField]<EntityType.BlockheadWalletConnection>('$$blockheadWalletConnections', {
				sources: [
					Source.Local_Internal,
				],
			})
		}
		id='blockhead-wallet-connections'
	/>
</Page>
