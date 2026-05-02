<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import ActorCoinsView from '$/views/ActorCoinsView.svelte'
	import Page from '$/components/Page.svelte'
	import ActorsView from '$/views/ActorsView.svelte'
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="Accounts"
		href={resolve('/~/accounts')}
	>
		<BlockheadWalletConnectionsView
			href={resolve('/~/accounts')}
			id="wallet-connections"
		/>

		<ActorsView
			entityFieldReference={{
				entityType: EntityType._Global,
				entityId: {},
				fieldName: '$$actors',
			}}
			href={resolve('/~/accounts')}
			id="accounts"
		/>

		<ActorCoinsView
			entityFieldReference={{
				entityType: EntityType._Global,
				entityId: {},
				fieldName: '$$actorCoins',
			}}
			href={resolve('/~/accounts/balances')}
			id="account-balances"
		/>
	</GlobalView>
</Page>
