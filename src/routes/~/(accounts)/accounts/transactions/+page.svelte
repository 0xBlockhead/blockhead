<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransactionsView from '$/views/BridgeTransactionsView.svelte'
</script>


<Page>
	<BridgeTransactionsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$bridgeTransactions',
		}}
		href={resolve('/~/accounts/transactions')}
		id="transactions"
	/>
</Page>
