<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityFieldReference,
		title = 'ERC-4337 account factories',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Erc4337AccountFactory>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Erc4337AccountFactory}
	{id}
	{title}
	bind:open
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Account factories deploy ERC-4337 smart account implementations indexed by the explorer.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const network = useEntity(entityCollectionsContext, EntityType.EvmNetwork,
				entityFieldReference.entityId,
				({ fields: { $$erc4337AccountFactories: ({ sources: [
							Source.Blockscout_Rest,
						], limit: 16 }) } }),
			)}
			{@const accountFactories = derive(
				network,
				(network): readonly Entity<typeof schema, EntityType.Erc4337AccountFactory>[] => (
					(network.fields.$$erc4337AccountFactories?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Erc4337AccountFactory}
				id={`${id}-items`}
				href={href}
				getKey={(accountFactory) => stringify(accountFactory[EntityMetaKey.Id])}
				getSortValue={(accountFactory) => accountFactory[EntityMetaKey.Id].address}
				placeholderText="Loading account factories…"
				resource={accountFactories}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No indexed account factories yet.</p>
				{/snippet}

				{#snippet Item({ item: accountFactory })}
					<Erc4337AccountFactoryView
						entityId={accountFactory[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
