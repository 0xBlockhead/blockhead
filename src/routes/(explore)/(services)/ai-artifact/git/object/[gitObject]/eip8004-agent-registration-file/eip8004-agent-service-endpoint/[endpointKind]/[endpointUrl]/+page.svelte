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
	import Eip8004AgentServiceEndpointView from '$/views/Eip8004AgentServiceEndpointView.svelte'
</script>


<Page>
	<Eip8004AgentServiceEndpointView
		selection={select(EntityType.Eip8004AgentServiceEndpoint, data.selector)}
	/>
</Page>
