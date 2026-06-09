<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransactionsView from '$/views/BridgeTransactionsView.svelte'
</script>


<Page>
	<BridgeTransactionsView
		href={resolve('/bridge')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$bridgeTransactions' },
			fieldName: '$$bridgeTransactions',
		}}
		id="transactions"
	/>
</Page>
