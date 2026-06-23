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
	import IbcDenomTraceView from '$/views/IbcDenomTraceView.svelte'
</script>


<Page>
	<IbcDenomTraceView
		selection={select(EntityType.IbcDenomTrace, data.selector)}
	/>
</Page>
