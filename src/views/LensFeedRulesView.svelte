<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Feed rules',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensFeedRule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensFeedRule}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				ruleType: true,
				requirement: true,
				address: true,
			},
		})
	}
>
	{#snippet Item({ item: lensFeedRule })}
		{@const lensFeedRuleSelector = lensFeedRule[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensFeedRule}
			entitySelector={lensFeedRuleSelector}
			href={
				resolve(
					'/(social)/(lens)/lens/(lensNetwork)/feed/[address=evmAddress]/(lensFeed)/rule/[ruleId=stringSegment]',
					{
						address: lensFeedRuleSelector.$feed.address,
						ruleId: lensFeedRuleSelector.ruleId,
					}
				)
			}
		>
			{#snippet Title()}
				{lensFeedRule.ruleType || 'Lens feed rule'}
			{/snippet}

			{#snippet Value()}
				{[lensFeedRule.requirement, lensFeedRule.address].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
