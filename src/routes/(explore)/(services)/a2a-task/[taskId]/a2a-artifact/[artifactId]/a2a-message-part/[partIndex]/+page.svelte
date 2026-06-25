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
	import A2aMessagePartView from '$/views/A2aMessagePartView.svelte'
</script>


<Page>
	<A2aMessagePartView
		selection={select(EntityType.A2aMessagePart, data.selector)}
	/>
</Page>
