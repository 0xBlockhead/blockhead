<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EnsRecord>>
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
	const ensRecord = $derived(selection({
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.recordKey) ?? '')].filter(Boolean).join(' ') || 'ENS record')
	const viewDomId = $derived('ens-record-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.recordKey !== undefined && pendingEntity.$name !== undefined && pendingEntity.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]/record/[recordId=stringSegment]', {
			recordId: String(pendingEntity.recordKey ?? ''),
			ensName: String(pendingEntity.$name.name ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ensRecord}>
			{#snippet Pending()}
				{[String((pendingEntity.recordKey) ?? '')].filter(Boolean).join(' ') || title || 'ENS record'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.recordKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ensRecord}>
			{#snippet Pending()}
				<EnsNameView
					selection={select(EntityType.EnsName, selection.entitySelector.$name)}
					href={
						(selection.entitySelector.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
							ensName: String(selection.entitySelector.$name.name ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EnsNameView
					selection={select(EntityType.EnsName, selection.entitySelector.$name)}
					href={
						(selection.entitySelector.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
							ensName: String(selection.entitySelector.$name.name ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name, {})}
						href={
							(selection.entitySelector.$name.name !== undefined ? resolve('/ens/name/[ensName=stringSegment]', {
								ensName: String(selection.entitySelector.$name.name ?? ''),
							}) : undefined)
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
								fields: {
									recordKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const recordKey = pendingEntity.recordKey}
							{#if recordKey !== undefined && recordKey !== null}
								{String((recordKey) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									recordKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const recordKind = pendingEntity.recordKind}
							{#if recordKind !== undefined && recordKind !== null}
								{String((recordKind) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							coinType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const coinType = pendingEntity.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>Coin type</dt>
							<dd>
								<NumberValue value={Number(coinType)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinType = resolvedEntity.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>Coin type</dt>
							<dd>
								<NumberValue value={Number(coinType)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EnsRecord_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				emptyText='No ENS record observations yet.'
				id='EnsRecord_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
