<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.A2aAgentSkill, {
		$cardSnapshot: data.selector,
		skillId: params.skillId,
	}, {
		sources: [],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentSkillView from '$/views/A2aAgentSkillView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.skillId ?? '') || 'A2A agent skill' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.skillId || 'A2A agent skill')} • A2A agent skill • Blockhead</title>
</svelte:head>


<Page>
	<A2aAgentSkillView
		selection={pageSelection}
	/>
</Page>
