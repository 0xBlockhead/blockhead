<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { DeclarativeOrderBy } from '$/lib/tanstackDb/orderBySteps.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Currencies',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Currency>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const globalCurrenciesFieldOrderBy = (
		[
			[
				({ fieldRow }) => (
					(
						fieldRow[EntityMetaKey.Value] as {
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
				({ fieldRow }) => (
					(fieldRow[EntityMetaKey.Value] as { [EntityMetaKey.Id]: { iso4217: string } })[EntityMetaKey.Id].iso4217
				),
				'asc',
			],
		] as const satisfies DeclarativeOrderBy<{ fieldRow: unknown }>
	)

	const currencyTimestampsFieldOrderBy = (
		[
			[
				({ fieldRow }) => (
					(fieldRow[EntityMetaKey.Value] as { marketCap?: bigint }).marketCap
				),
				{
					direction: 'desc',
					nulls: 'last',
				},
			],
		] as const satisfies DeclarativeOrderBy<{ fieldRow: unknown }>
	)


	// State
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			...(open && {
				[fieldName]: {
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
			}),
		},
	)

	const currencies = derive(
		parent,
		(parent) => (
			parent[fieldName] ?? []
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Currency}
	getKey={(row) => row[EntityMetaKey.Id].iso4217}
	getSortValue={(row) => (
		-Number(row.$$timestamps?.[0]?.marketCap ?? 0)
	)}
	placeholderKeys={new SvelteSet()}
	resource={currencies}
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

	{#snippet Item({ item })}
		{#if item}
			<CurrencyView
				entityId={item[EntityMetaKey.Id]}
				href={resolve(
					'/(assets)/(currencies)/currency/[iso4217]',
					{ iso4217: item[EntityMetaKey.Id].iso4217 },
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
