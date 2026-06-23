<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	const listView = {
		entityType: EntityType.Network,
		emptyText: 'No networks to show yet.',
		item: 'Summary',
		placeholderText: 'Loading networks…',
		query: {
			sources: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.CosmosChainRegistry_Github,
				Source.EthereumLists_Rest,
				Source.L2Beat_Rest,
				Source.Superchain_Github,
				Source.TrustWalletAssets_Github,
			],
		},
		itemLayout: EntityLayout.Summary,
		orientation: 'column',
	} as const

	let {
		selection,
		title,
		open = $bindable(true),
		id = 'Networks',
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Network>
			title?: string
			open?: boolean
			id?: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntitiesList
	entityType={listView.entityType}
	{title}
	bind:open
	{id}
	href={href}
	resource={selection(listView.query)}
	getKey={(entity) => stringify(entity.entitySelector)}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	placeholderText={listView.placeholderText}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			{listView.emptyText}
		</p>
	{/snippet}

	{#snippet Item({ item })}
		<NetworkView
			selection={select(EntityType.Network, item.entitySelector)}
			layout={listView.itemLayout}
		/>
	{/snippet}
</EntitiesList>
