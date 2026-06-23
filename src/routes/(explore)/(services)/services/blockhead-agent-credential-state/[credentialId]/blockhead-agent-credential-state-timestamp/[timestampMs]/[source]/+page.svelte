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
	import BlockheadAgentCredentialState_TimestampView from '$/views/BlockheadAgentCredentialState_TimestampView.svelte'
</script>


<Page>
	<BlockheadAgentCredentialState_TimestampView
		selection={select(EntityType.BlockheadAgentCredentialState_Timestamp, data.selector)}
	/>
</Page>
