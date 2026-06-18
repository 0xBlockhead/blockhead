<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType._Global,
			{ scope: '$$bridgeTransactions' }
		).$$bridgeTransactions}
		id="transactions"
	/>
</Page>
