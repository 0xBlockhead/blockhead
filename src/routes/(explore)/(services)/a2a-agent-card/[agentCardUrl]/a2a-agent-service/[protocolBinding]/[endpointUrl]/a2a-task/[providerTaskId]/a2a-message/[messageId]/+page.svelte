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
	import A2aMessageView from '$/views/A2aMessageView.svelte'
</script>


<Page>
	<A2aMessageView
		selection={select(EntityType.A2aMessage, data.selector)}
	/>
</Page>
