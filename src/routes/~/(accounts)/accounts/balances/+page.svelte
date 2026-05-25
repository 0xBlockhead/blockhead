<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActorCoinsView from '$/views/ActorCoinsView.svelte'
</script>


<Page>
	<ActorCoinsView
		href={resolve('/~/(accounts)/accounts/balances')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$actorCoins',
		}}
		id="balances"
	/>
</Page>
