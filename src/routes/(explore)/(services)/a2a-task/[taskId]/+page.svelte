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
	import A2aTaskView from '$/views/A2aTaskView.svelte'
</script>


<Page>
	<A2aTaskView
		selection={select(EntityType.A2aTask, data.selector)}
	/>
</Page>
