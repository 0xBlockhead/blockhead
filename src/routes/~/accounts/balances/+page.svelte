<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
</script>


<svelte:head>
	<title>Balances • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkActorCoinBalancesView
		href={resolve('/~/accounts/balances')}
		title='Balances'
		selection={
			select(EntityType._Global, {
				scope: '$$actorCoins',
			}).$$actorCoins({
				sources: [
					Source.Allium_Rest,
				],
			})
		}
		id='actor-coins'
	/>
</Page>
