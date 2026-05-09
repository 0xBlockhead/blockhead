<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
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

	const booleanField = (fields: JsonValue, key: string) => (
		((value: JsonValue) => (
			typeof value === 'boolean' ?
				value
			:
				undefined
		))(fieldValue(fields, key))
	)

	const numberField = (fields: JsonValue, key: string) => (
		((value: JsonValue) => (
			typeof value === 'number' ?
				value
			:
				undefined
		))(fieldValue(fields, key))
	)

	const stringField = (fields: JsonValue, key: string) => (
		((value: JsonValue) => (
			typeof value === 'string' && value.length > 0 ?
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
			entityId: typeof BeaconSlotSchema.id.infer
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
				'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
				{
					networkId: String(entityId.$network.chainId),
					slotNumber: String(entityId.slot),
				},
			)
		),
	)

	const title = $derived(
		titleProp ?? `Slot ${entityId.slot.toLocaleString()}`,
	)

	const slotIdKey = $derived(
		stringify(entityId),
	)

	const slotQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BeaconSlot] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						slotIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => slotIdKey],
	)

	const slotRow = $derived(
		(
			slotQuery.data?.find(
				(row) => row.row[EntityMetaKey.Source] === Source.Beacon_Rest,
			)?.row
			?? slotQuery.data?.[0]?.row
		)
	)

	const slotField = $derived(
		{
			epoch: numberField(slotRow?.[EntityMetaKey.Fields], 'epoch'),
			proposerIndex: numberField(slotRow?.[EntityMetaKey.Fields], 'proposerIndex'),
			root: stringField(slotRow?.[EntityMetaKey.Fields], 'root'),
			parentRoot: stringField(slotRow?.[EntityMetaKey.Fields], 'parentRoot'),
			stateRoot: stringField(slotRow?.[EntityMetaKey.Fields], 'stateRoot'),
			bodyRoot: stringField(slotRow?.[EntityMetaKey.Fields], 'bodyRoot'),
			canonical: booleanField(slotRow?.[EntityMetaKey.Fields], 'canonical'),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlot}
	{entityId}
	{title}
	{href}
	{layout}
	{open}
	idDragPlainText={String(entityId.slot)}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Slot</dt>
				<dd>
					<NumberValue value={entityId.slot} />
				</dd>
			</div>
			{#if slotField?.epoch !== undefined}
				<div>
					<dt>Epoch</dt>
					<dd>
						<NumberValue value={slotField.epoch} />
					</dd>
				</div>
			{/if}
			{#if slotField?.proposerIndex !== undefined}
				<div>
					<dt>Proposer</dt>
					<dd>
						<NumberValue value={slotField.proposerIndex} />
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BeaconSlot}
			{entityId}
		>
			<QueryBoundary
				placeholderText="Loading slot…"
				query={slotQuery}
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
							No slot data for this network yet. Try again shortly.
						</p>
					{:else}
						<dl>
							{#if slotField?.root !== undefined}
								<div>
									<dt>Root</dt>
									<dd>
										<TruncatedValue
											value={slotField.root}
											format={TruncatedValueFormat.Abbr}
										/>
									</dd>
								</div>
							{/if}
							{#if slotField?.parentRoot !== undefined}
								<div>
									<dt>Parent root</dt>
									<dd>
										<TruncatedValue
											value={slotField.parentRoot}
											format={TruncatedValueFormat.Abbr}
										/>
									</dd>
								</div>
							{/if}
							{#if slotField?.stateRoot !== undefined}
								<div>
									<dt>State root</dt>
									<dd>
										<TruncatedValue
											value={slotField.stateRoot}
											format={TruncatedValueFormat.Abbr}
										/>
									</dd>
								</div>
							{/if}
							{#if slotField?.bodyRoot !== undefined}
								<div>
									<dt>Body root</dt>
									<dd>
										<TruncatedValue
											value={slotField.bodyRoot}
											format={TruncatedValueFormat.Abbr}
										/>
									</dd>
								</div>
							{/if}
							{#if slotField?.canonical !== undefined}
								<div>
									<dt>Canonical</dt>
									<dd>
										{slotField.canonical ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
