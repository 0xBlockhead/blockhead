<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// State
	let {
		title = 'Currencies',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
				...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Currency>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// Functions
	const globalCurrenciesFieldOrderBy = (
		[
			[
				({ field }) => (
					(
						field[EntityMetaKey.Value] as {
							$$timestamps?: { marketCap?: bigint }[]
						}
					).$$timestamps?.[0]?.marketCap
				),
				{
					direction: 'desc',
					nulls: 'last',
				},
			],
			[
				({ field }) => (
					(field[EntityMetaKey.Value] as { [EntityMetaKey.Id]: { iso4217: string } })[EntityMetaKey.Id].iso4217
				),
				'asc',
			],
		] as const satisfies DeclarativeOrderBy<{ field: unknown }>
	)

	const currencyTimestampsFieldOrderBy = (
		[
			[
				({ field }) => (
					(field[EntityMetaKey.Value] as { marketCap?: bigint }).marketCap
				),
				{
					direction: 'desc',
					nulls: 'last',
				},
			],
		] as const satisfies DeclarativeOrderBy<{ field: unknown }>
	)


	// State
	import type { DeclarativeOrderBy } from '$/lib/tanstackDb/orderBySteps.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.Currency}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ISO&nbsp;4217 fiat units referenced as market quote legs (USD, EUR, …).
		</p>
		<p>
			Ordered by catalog FX turnover weight (see each currency’s snapshot), not alphabetically.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No currencies in this context yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
					],
					[entityFieldReference.fieldName]: {
						$orderBy: globalCurrenciesFieldOrderBy,
						$limit: 512,
						$$timestamps: {
							$: [
								Source.Constants_Internal,
							],
							$orderBy: currencyTimestampsFieldOrderBy,
							$limit: 1,
							marketCap: {},
						},
					},
				},
			)}
			{@const currencies = derive(
				parent,
				(parent) => (
					parent[entityFieldReference.fieldName] ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...EntitiesListProps}
				entityType={EntityType.Currency}
				getKey={(row) => row[EntityMetaKey.Id].iso4217}
				getSortValue={(row) => (
					-Number(row.$$timestamps?.[0]?.marketCap ?? 0)
				)}
				resource={currencies}
				{title}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No currencies in this context yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<CurrencyView
						entityId={item[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
