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
	import AptosEventView from '$/views/AptosEventView.svelte'
</script>


<Page>
	<AptosEventView
		selection={select(EntityType.AptosEvent, data.selector)}
	/>
</Page>
