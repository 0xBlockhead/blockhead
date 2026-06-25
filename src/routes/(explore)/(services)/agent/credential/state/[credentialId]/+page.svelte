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
	import BlockheadAgentCredentialStateView from '$/views/BlockheadAgentCredentialStateView.svelte'
</script>


<Page>
	<BlockheadAgentCredentialStateView
		selection={select(EntityType.BlockheadAgentCredentialState, data.selector)}
	/>
</Page>
