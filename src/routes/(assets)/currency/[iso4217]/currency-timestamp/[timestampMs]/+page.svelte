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
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
</script>


<Page>
	<Currency_TimestampView
		selection={select(EntityType.Currency_Timestamp, data.selector)}
	/>
</Page>
