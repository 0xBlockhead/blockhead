<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		title = 'Coin instances',
		open = $bindable(true),
		href,
		id,
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			href: string
			id: string
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.CoinInstance
			>
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_Rest,
				Source.Constants_Internal,
			],
			[entityFieldReference.fieldName]: {
				$: [Source.Coingecko_Rest],
			},
		},
	)

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.CoinInstance>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						stringify(a[EntityMetaKey.Id]).localeCompare(stringify(b[EntityMetaKey.Id]))
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.CoinInstance}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	{href}
	{id}
	placeholderKeys={new SvelteSet()}
	resource={envelopes}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No instances indexed yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<CoinInstanceView
				entityId={props.item.value[EntityMetaKey.Id]}
				{href}
				id={stringify(props.item.value[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
