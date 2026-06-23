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
	import MoveFunctionView from '$/views/MoveFunctionView.svelte'
</script>


<Page>
	<MoveFunctionView
		selection={select(EntityType.MoveFunction, data.selector)}
	/>
</Page>
