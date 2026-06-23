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
	import A2aTaskEventView from '$/views/A2aTaskEventView.svelte'
</script>


<Page>
	<A2aTaskEventView
		selection={select(EntityType.A2aTaskEvent, data.selector)}
	/>
</Page>
