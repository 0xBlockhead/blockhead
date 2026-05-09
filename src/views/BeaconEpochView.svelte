<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const fieldValue = (fields: JsonValue, key: string): JsonValue => (
		fields !== undefined && typeof fields === 'object' && fields !== null ?
			Object.getOwnPropertyDescriptor(fields, key)?.value
		:
			undefined
	)

	const numberField = (fields: JsonValue, key: string) => (
		((value: JsonValue) => (
			typeof value === 'number' ?
				value
			:
				undefined
		))(fieldValue(fields, key))
	)


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		href: hrefProp,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: typeof BeaconEpochSchema.id.infer
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'Content'
			| 'Details'
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
		>
	> = $props()


	// (Derived)
	const href = $derived(
		hrefProp ?? (
			resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
				{
					networkId: String(entityId.$network.chainId),
					epochNumber: String(entityId.epoch),
				},
			)
		),
	)

	const title = $derived(
		titleProp ?? `Epoch ${entityId.epoch.toLocaleString()}`,
	)

	const epochIdKey = $derived(
		stringify(entityId),
	)

	const epochQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BeaconEpoch] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						epochIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => epochIdKey],
	)

	const epochRow = $derived(
		(
			epochQuery.data?.find(
				(row) => row.row[EntityMetaKey.Source] === Source.Beacon_Rest,
			)?.row
			?? epochQuery.data?.[0]?.row
		)
	)

	const epochField = $derived(
		{
			startSlot: numberField(epochRow?.[EntityMetaKey.Fields], 'startSlot'),
			endSlot: numberField(epochRow?.[EntityMetaKey.Fields], 'endSlot'),
			slotCount: numberField(epochRow?.[EntityMetaKey.Fields], 'slotCount'),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	{entityId}
	{title}
	{href}
	{layout}
	{open}
	idDragPlainText={String(entityId.epoch)}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Epoch</dt>
				<dd>
					<NumberValue value={entityId.epoch} />
				</dd>
			</div>
			{#if epochField?.startSlot !== undefined && epochField.endSlot !== undefined}
				<div>
					<dt>Slot range</dt>
					<dd>
						<NumberValue value={epochField.startSlot} />
						to
						<NumberValue value={epochField.endSlot} />
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BeaconEpoch}
			{entityId}
		>
			<QueryBoundary
				placeholderText="Loading epoch…"
				query={epochQuery}
			>
				{#snippet children(rows)}
					{@const row = (
						rows?.find(
							(row) => row.row[EntityMetaKey.Source] === Source.Beacon_Rest,
						)?.row
						?? rows?.[0]?.row
					)}
					{#if row === undefined}
						<p data-text="muted">
							No epoch data for this network yet. Try again shortly.
						</p>
					{:else}
						<dl>
							{#if epochField?.slotCount !== undefined}
								<div>
									<dt>Slots</dt>
									<dd>
										<NumberValue value={epochField.slotCount} />
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<BeaconSlotsView
			entityFieldReference={{
				entityType: EntityType.BeaconEpoch,
				entityId,
				fieldName: '$$beaconSlots',
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/beacon-slots',
				{
					networkId: String(entityId.$network.chainId),
				},
			)}
			id={`${epochIdKey}:beacon-slots`}
			open={false}
			title="Slots"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
