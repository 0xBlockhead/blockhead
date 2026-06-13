<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'

	type CurrencyOrderFieldRow = {
		$$timestamps?: {
			0?: {
				marketCap?: bigint
			}
		}
		marketCap?: bigint
		[EntityMetaKey.Id]: {
			iso4217: string
		}
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: {
				iso4217: string
			}
			$$timestamps?: {
				0?: {
					marketCap?: bigint
				}
			}
			marketCap?: bigint
		}
	}


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
			open?: boolean
			collapsible?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Currency>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	// Functions
	const globalCurrenciesFieldOrderBy = (
		[
			[
				({ fieldRow }) => (
					fieldRow.$$timestamps?.[0]?.marketCap
				),
				{
					direction: 'desc',
				},
			],
			[
				({ fieldRow }) => (
					fieldRow[EntityMetaKey.Id].iso4217
				),
				'asc',
			],
		] as const satisfies DeclarativeOrderBy<CurrencyOrderFieldRow>
	)

	const currencyTimestampsFieldOrderBy = (
		[
			[
				({ fieldRow }) => (
					fieldRow.marketCap
				),
				{
					direction: 'desc',
				},
			],
		] as const satisfies DeclarativeOrderBy<CurrencyOrderFieldRow>
	)


	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import type { DeclarativeOrderBy } from '$/client/$client.svelte.ts'
	import { subscribe } from '$/routes/+layout.svelte'


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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Constants_Internal,
					], fields: { [entityFieldReference.fieldName]: {
						orderBy: [...globalCurrenciesFieldOrderBy],
						limit: 512,
						$$timestamps: {
							sources: [
								Source.Constants_Internal,
							],
							orderBy: currencyTimestampsFieldOrderBy,
							limit: 1,
							fields: {
								marketCap: true,
							},
						},
					},
				} }),
			)}
			{@const currencies = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.Currency>[] => (
					parent.fields[entityFieldReference.fieldName]?.values ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...EntitiesListProps}
				entityType={EntityType.Currency}
				getKey={(currency) => currency[EntityMetaKey.Id].iso4217}
				getSortValue={(currency) => (
					-Number(currency.$$timestamps?.[0]?.marketCap ?? 0)
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
