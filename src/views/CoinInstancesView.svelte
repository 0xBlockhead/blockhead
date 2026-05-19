<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		title = 'Deployments',
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
		(
			open ?
				{
					$: [
						Source.Coingecko_Rest,
						Source.CoinMarketCap_Rest,
						Source.Coinpaprika_OpenApi,
						Source.Defillama_OpenApi,
						Source.Constants_Internal,
					],
					[entityFieldReference.fieldName]: {
						$: [Source.Coingecko_Rest],
					},
				}
			:
				{}
		),
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
	import Tooltip from '$/components/Tooltip.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
</script>


<div data-column="gap-2">
	<EntitiesList
		{...entitiesListRest}
		bind:open
		entityType={EntityType.CoinInstance}
		getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
		getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
		{href}
		{id}
		placeholderKeys={new SvelteSet()}
		placeholderText="Loading deployments…"
		resource={envelopes}
		{title}
		UnorderedListProps={{ orientation: ListOrientation.Column }}
	>
		{#snippet TypeAnnotationTooltip()}
						<p>
							Deployments are concrete representations of this asset on a chain: native currency or a token contract.
						</p>
						<p>
							The same logical coin can exist on many networks; each row is one chain-specific instance.
						</p>
		{/snippet}
		{#snippet Empty()}
			<p data-text="muted">
				No deployments yet.
			</p>
		{/snippet}

		{#snippet Item({ item })}
			{#if item}
				<CoinInstanceView
					entityId={item.value[EntityMetaKey.Id]}
					{href}
					id={stringify(item.value[EntityMetaKey.Id])}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
