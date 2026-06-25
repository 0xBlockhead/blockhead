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
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
</script>


<Page>
	<Eip8004AgentRegistrationFileView
		selection={select(EntityType.Eip8004AgentRegistrationFile, data.selector)}
	/>
</Page>
