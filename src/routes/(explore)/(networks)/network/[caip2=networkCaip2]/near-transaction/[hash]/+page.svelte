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
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<Page>
	<NearTransactionView
		selection={select(EntityType.NearTransaction, data.selector)}
	/>
</Page>
