<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<Page>
	<EvmTransactionsView
		href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', params)}
		id="transactions"
	/>
</Page>
