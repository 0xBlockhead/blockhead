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
	import BlockheadAgentProviderCallView from '$/views/BlockheadAgentProviderCallView.svelte'
</script>


<Page>
	<BlockheadAgentProviderCallView
		selection={select(EntityType.BlockheadAgentProviderCall, data.selector)}
	/>
</Page>
