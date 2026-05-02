<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import ActorCoinsView from '$/views/ActorCoinsView.svelte'
</script>


<Page>
	<ActorCoinsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$actorCoins',
		}}
		href={resolve('/~/accounts/balances')}
		id="balances"
	/>
</Page>
