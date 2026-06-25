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
	import A2aAgentSkillView from '$/views/A2aAgentSkillView.svelte'
</script>


<Page>
	<A2aAgentSkillView
		selection={select(EntityType.A2aAgentSkill, data.selector)}
	/>
</Page>
