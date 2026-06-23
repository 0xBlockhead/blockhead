<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	const listView = {
		entityType: EntityType.CoinBridgeCapability,
		item: 'summary',
		orientation: 'column',
	} as const

	let {
		selection,
		title,
		open = $bindable(true),
		id = 'CoinBridgeCapabilitys',
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CoinBridgeCapability>
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
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


<EntitiesList
	entityType={listView.entityType}
	{title}
	bind:open
	{id}
	href={href}
	resource={selection}
	getKey={(entity) => stringify(entity.entitySelector)}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Item({ item })}
		<CoinBridgeCapabilityView
			selection={select(EntityType.CoinBridgeCapability, item.entitySelector)}
			layout={EntityLayout.Summary}
		/>
	{/snippet}
</EntitiesList>
