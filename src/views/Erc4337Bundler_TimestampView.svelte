<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337Bundler_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Erc4337Bundler_Timestamp>>
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
	const erc4337BundlerTimestamp = $derived(selection({
		fields: {
			userOperationsCount: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 bundler timestamp')
	const viewDomId = $derived('erc4337bundler-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337Bundler_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$bundler !== undefined && pendingEntity.$bundler.$network !== undefined && pendingEntity.$bundler.$network.caip2 !== undefined && pendingEntity.$bundler.$network.caip2.namespace !== undefined && pendingEntity.$bundler !== undefined && pendingEntity.$bundler.$network !== undefined && pendingEntity.$bundler.$network.caip2 !== undefined && pendingEntity.$bundler.$network.caip2.reference !== undefined && pendingEntity.$bundler !== undefined && pendingEntity.$bundler.address !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(pendingEntity.$bundler.$network.caip2.namespace ?? '')}:${String(pendingEntity.$bundler.$network.caip2.reference ?? '')}`,
			address: String(pendingEntity.$bundler.address ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={erc4337BundlerTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={erc4337BundlerTimestamp}>
			{#snippet Pending()}
				{@const userOperationsCount0 = prefetched.userOperationsCount}
				{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
					<NumberValue value={Number(userOperationsCount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const userOperationsCount0 = resolvedEntity.userOperationsCount}
				{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
					<NumberValue value={Number(userOperationsCount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={erc4337BundlerTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							userOperationsCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const userOperationsCount = prefetched.userOperationsCount}
					{#if userOperationsCount !== undefined && userOperationsCount !== null}
						<div>
							<dt>User operations</dt>
							<dd>
								<NumberValue value={Number(userOperationsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userOperationsCount = resolvedEntity.userOperationsCount}
					{#if userOperationsCount !== undefined && userOperationsCount !== null}
						<div>
							<dt>User operations</dt>
							<dd>
								<NumberValue value={Number(userOperationsCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Bundler</dt>
				<dd>
					<Erc4337BundlerView
						selection={select(EntityType.Erc4337Bundler, selection.entitySelector.$bundler)}
						href={
							(selection.entitySelector.$bundler.$network !== undefined && selection.entitySelector.$bundler.$network.caip2 !== undefined && selection.entitySelector.$bundler.$network.caip2.namespace !== undefined && selection.entitySelector.$bundler.$network !== undefined && selection.entitySelector.$bundler.$network.caip2 !== undefined && selection.entitySelector.$bundler.$network.caip2.reference !== undefined && selection.entitySelector.$bundler.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$bundler.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$bundler.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$bundler.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
