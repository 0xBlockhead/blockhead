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
	import AptosTableItemView from '$/views/AptosTableItemView.svelte'
</script>


<Page>
	<AptosTableItemView
		selection={select(EntityType.AptosTableItem, data.selector)}
	/>
</Page>
