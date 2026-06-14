<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType._Global,
			selector: { scope: '$$actorCoins' },
			fieldName: '$$actorCoins',
		}}
		id="balances"
	/>
</Page>
