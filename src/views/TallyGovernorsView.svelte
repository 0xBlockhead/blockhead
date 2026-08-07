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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TallyGovernor> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TallyGovernor}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				organizationName: true,
				governorType: true,
				slug: true,
				governorId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: tallyGovernor })}
		{@const tallyGovernorSelector = tallyGovernor[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TallyGovernor}
			entitySelector={tallyGovernorSelector}
			href={
				resolve(
					'/tally/governor/[governorId=stringSegment]',
					{
						governorId: encodeURIComponent(tallyGovernorSelector.governorId),
					}
				)
			}
		>
			{#snippet Title()}
				{[(tallyGovernor.name ?? ''), (tallyGovernor.organizationName ?? '')].filter(Boolean).join(' ') || tallyGovernorSelector.governorId || 'Tally governor'}
			{/snippet}

			{#snippet Value()}
				{[(tallyGovernor.governorType ?? ''), (tallyGovernor.slug ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tallyGovernor.$network.name || (tallyGovernor.$network.caip2 == null ? '' : `${tallyGovernor.$network.caip2.namespace}:${tallyGovernor.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
