<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
</script>


<Page>
	<EvmNetworkActorCoinBalancesView
		href={resolve('/~/(accounts)/accounts/balances')}
		selection={select(
			EntityType._Global,
			{ scope: '$$actorCoins' }
		).$$actorCoins}
		id="balances"
	/>
</Page>
