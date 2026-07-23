<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.EnsRecord>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EnsRecord>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const ensRecord = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.recordKey) ?? '')].filter(Boolean).join(' ') || 'ENS record')
	const viewDomId = $derived('ens-record-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EnsRecord_TimestampsView from '$/views/EnsRecord_TimestampsView.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsRecord}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'recordKey' in selection.entitySelector
			&& selection.entitySelector.recordKey != null
			&& selection.entitySelector != null && '$name' in selection.entitySelector
			&& selection.entitySelector.$name != null && 'name' in selection.entitySelector.$name
			&& selection.entitySelector.$name.name != null ?
				resolve('/ens/name/[ensName=stringSegment]/record/[recordId=stringSegment]', {
			recordId: encodeURIComponent(String(selection.entitySelector.recordKey ?? '')),
			ensName: encodeURIComponent(String(selection.entitySelector.$name.name ?? '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$name') && prefetched.$name != null}
			{[String((pendingEntity.recordKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={ensRecord}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.recordKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$name') && prefetched.$name != null}
			{@const ensName0 = pendingEntity.$name}
			{#if ensName0 != null && selection.entitySelector.$name != null}
				<EnsNameView
					selection={select(EntityType.EnsName, selection.entitySelector.$name, { sources: selection.sources })}
					prefetched={ensName0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={ensRecord}>
				{#snippet children(entity)}
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						href={
							(
								selection.entitySelector.$name != null && 'name' in selection.entitySelector.$name
								&& selection.entitySelector.$name.name != null ?
									resolve('/ens/name/[ensName=stringSegment]', {
								ensName: encodeURIComponent(String(selection.entitySelector.$name.name ?? '')),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Record key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									recordKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const recordKey = resolvedEntity.recordKey}
							{#if recordKey !== undefined && recordKey !== null}
								{String((recordKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Record kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									recordKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const recordKind = resolvedEntity.recordKind}
							{#if recordKind !== undefined && recordKind !== null}
								{String((recordKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							coinType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinType = resolvedEntity.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>Coin type</dt>
							<dd>
								<NumberValue
									value={coinType}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const ensRecordEnsRecordTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={ensRecordEnsRecordTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<EnsRecord_TimestampsView
					selection={ensRecordEnsRecordTimestampsViewTimestampsResource}
					countResource={ensRecordEnsRecordTimestampsViewTimestampsResource.count}
					title='Observations'
					id='EnsRecord_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
