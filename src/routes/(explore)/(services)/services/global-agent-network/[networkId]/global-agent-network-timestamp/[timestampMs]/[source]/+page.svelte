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
	import GlobalAgentNetwork_TimestampView from '$/views/_GlobalAgentNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalAgentNetwork_TimestampView
		selection={select(EntityType._GlobalAgentNetwork_Timestamp, data.selector)}
	/>
</Page>
