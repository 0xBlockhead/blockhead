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
	import A2aAgentCardView from '$/views/A2aAgentCardView.svelte'
</script>


<Page>
	<A2aAgentCardView
		selection={select(EntityType.A2aAgentCard, data.selector)}
	/>
</Page>
