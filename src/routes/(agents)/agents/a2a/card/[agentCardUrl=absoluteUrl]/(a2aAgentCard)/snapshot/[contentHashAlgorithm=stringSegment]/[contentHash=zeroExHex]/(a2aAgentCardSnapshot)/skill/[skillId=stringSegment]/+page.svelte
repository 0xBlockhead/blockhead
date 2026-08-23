<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentSkillView from '$/views/A2aAgentSkillView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aAgentSkill, {
					$cardSnapshot: data.selector,
					skillId: params.skillId,
				}, {
					sources: [],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.skillId ?? '') || 'A2A agent skill' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.skillId || 'A2A agent skill')} • A2A agent skill • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'A2A agent skill'} • A2A agent skill • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aAgentSkill, {
					$cardSnapshot: data.selector,
					skillId: params.skillId,
				}, {
					sources: [],
					fields: {
						name: true,
					},
				}))}

		<A2aAgentSkillView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
