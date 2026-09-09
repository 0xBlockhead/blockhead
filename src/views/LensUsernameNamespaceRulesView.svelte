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
		title = 'Namespace rules',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensUsernameNamespaceRule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensUsernameNamespaceRule}
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
	{#snippet Item({ item: lensUsernameNamespaceRule })}
		{@const lensUsernameNamespaceRuleSelector = lensUsernameNamespaceRule[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensUsernameNamespaceRule}
			entitySelector={lensUsernameNamespaceRuleSelector}
			href={
				resolve(
					'/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]/(lensUsernameNamespace)/rule/[ruleId=stringSegment]',
					{
						address: lensUsernameNamespaceRuleSelector.$namespace.address,
						ruleId: lensUsernameNamespaceRuleSelector.ruleId,
					}
				)
			}
		>
			{#snippet Title()}
				{lensUsernameNamespaceRule.ruleType || 'Lens username namespace rule'}
			{/snippet}

			{#snippet Value()}
				{[lensUsernameNamespaceRule.requirement, lensUsernameNamespaceRule.address].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
