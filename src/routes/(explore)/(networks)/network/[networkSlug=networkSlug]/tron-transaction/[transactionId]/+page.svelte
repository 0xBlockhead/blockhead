<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TronTransactionView from '$/views/TronTransactionView.svelte'
</script>


<Page>
	<TronTransactionView
		selection={select(EntityType.TronTransaction, data.selector)}
	/>
</Page>
