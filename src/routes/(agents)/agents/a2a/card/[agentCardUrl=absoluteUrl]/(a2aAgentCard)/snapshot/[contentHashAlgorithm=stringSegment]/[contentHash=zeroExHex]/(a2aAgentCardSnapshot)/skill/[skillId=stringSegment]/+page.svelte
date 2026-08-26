<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aAgentSkill, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.skillId ?? '') || 'A2A agent skill' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.skillId || 'A2A agent skill')} • A2A agent skill • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A agent skill'} • A2A agent skill • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aAgentSkillView
		selection={pageSelection}
	/>
	{/if}
</Page>
