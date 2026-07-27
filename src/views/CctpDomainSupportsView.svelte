<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CctpDomainSupport> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpDomainSupport}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				domainId: true,
				cctpVersion: true,
			},
		})
	}
>
	{#snippet Item({ item: cctpDomainSupport })}
		{@const cctpDomainSupportSelector = cctpDomainSupport[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CctpDomainSupport}
			entitySelector={cctpDomainSupportSelector}
		>
			{#snippet Title()}
				{cctpDomainSupport.name || 'CCTP domain support'}
			{/snippet}

			{#snippet Value()}
				{String(cctpDomainSupportSelector.domainId)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(cctpDomainSupportSelector.cctpVersion)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
