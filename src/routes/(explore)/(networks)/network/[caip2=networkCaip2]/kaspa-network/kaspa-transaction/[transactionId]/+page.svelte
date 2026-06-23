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
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<Page>
	<KaspaTransactionView
		selection={select(EntityType.KaspaTransaction, data.selector)}
	/>
</Page>
