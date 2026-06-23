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
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<Page>
	<AiModelProviderView
		selection={select(EntityType.AiModelProvider, data.selector)}
	/>
</Page>
