<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBridgeTransactionsView from '$/views/BlockheadBridgeTransactionsView.svelte'
</script>


<Page>
	<BlockheadBridgeTransactionsView
		href={resolve('/bridge')}
		selection={select(
			EntityType._Global,
			{ scope: '$$bridgeTransactions' }
		).$$bridgeTransactions}
		id="transactions"
	/>
</Page>
