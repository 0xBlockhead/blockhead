<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransactionsView from '$/views/BridgeTransactionsView.svelte'
</script>


<Page>
	<BridgeTransactionsView
		href={resolve('/~/accounts/transactions')}
		id="transactions"
	/>
</Page>
