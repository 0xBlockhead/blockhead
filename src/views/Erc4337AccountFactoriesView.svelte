<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
		import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		selection,
		title = 'ERC-4337 account factories',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
				<ResourceBoundary
					resource={selection({
						sources: [
							Source.Blockscout_Rest,
						],
						limit: 16,
					})}
				placeholderText="Loading account factories…"
			>
				{#snippet children(accountFactories)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Erc4337AccountFactory}
				id={`${id}-items`}
				href={href}
				getKey={(accountFactory) => stringify(accountFactory.entitySelector)}
				getSortValue={(accountFactory) => accountFactory.entitySelector.address}
				placeholderText="Loading account factories…"
				items={accountFactories.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No indexed account factories yet.</p>
				{/snippet}

				{#snippet Item({ item: accountFactory })}
					<Erc4337AccountFactoryView
						selector={accountFactory.entitySelector}
						selection={accountFactory}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
