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
	import A2aAgentInterfaceView from '$/views/A2aAgentInterfaceView.svelte'
</script>


<Page>
	<A2aAgentInterfaceView
		selection={select(EntityType.A2aAgentInterface, data.selector)}
	/>
</Page>
