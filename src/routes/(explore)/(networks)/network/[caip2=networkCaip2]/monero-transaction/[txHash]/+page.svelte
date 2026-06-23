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
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
</script>


<Page>
	<MoneroTransactionView
		selection={select(EntityType.MoneroTransaction, data.selector)}
	/>
</Page>
