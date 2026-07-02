<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EnsRecord_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EnsRecord_Timestamp>>
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

	const ensRecordTimestamp = $derived(selection({
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			value: true,
		},
	}))
	const titleFallback = $derived('ENS record observation')
	const viewDomId = $derived('ens-record-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EnsRecordView from '$/views/EnsRecordView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsRecord_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<EnsRecordView
				selection={select(EntityType.EnsRecord, selection.entitySelector.$record)}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={ensRecordTimestamp}>
				{#snippet Pending()}
					<EnsRecordView
						selection={select(EntityType.EnsRecord, selection.entitySelector.$record)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<EnsRecordView
						selection={select(EntityType.EnsRecord, selection.entitySelector.$record)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={ensRecordTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={ensRecordTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={ensRecordTimestamp}>
				{#snippet Pending()}
					{@const value = prefetched.value ?? selection.entitySelector.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<TruncatedValue value={String(value)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const value = entity.value ?? selection.entitySelector.value ?? prefetched.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								<TruncatedValue value={String(value)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
