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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.Erc4337Bundler_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Erc4337Bundler_Timestamp>
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
	const erc4337BundlerTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			userOperationsCount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			userOperationsCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 bundler timestamp')
	const viewDomId = $derived('erc4337bundler-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$bundler' in selection.entitySelector
			&& selection.entitySelector.$bundler != null && 'address' in selection.entitySelector.$bundler
			&& selection.entitySelector.$bundler.address != null
			&& selection.entitySelector.$bundler != null && '$network' in selection.entitySelector.$bundler ?
				selection.entitySelector.$bundler.$network != null && 'caip2' in selection.entitySelector.$bundler.$network
				&& selection.entitySelector.$bundler.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: String(selection.entitySelector.timestampMs ?? ''),
				source: String(selection.entitySelector.source ?? ''),
				address: String(selection.entitySelector.$bundler.address ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$bundler.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$bundler.$network != null && 'slug' in selection.entitySelector.$bundler.$network
					&& selection.entitySelector.$bundler.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(selection.entitySelector.timestampMs ?? ''),
					source: String(selection.entitySelector.source ?? ''),
					address: String(selection.entitySelector.$bundler.address ?? ''),
					network: String(selection.entitySelector.$bundler.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'userOperationsCount')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337BundlerTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'userOperationsCount')}
			{@const userOperationsCount0 = pendingEntity.userOperationsCount}
			{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
				<NumberValue
					value={userOperationsCount0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337BundlerTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userOperationsCount0 = resolvedEntity.userOperationsCount}
					{#if userOperationsCount0 !== undefined && userOperationsCount0 !== null}
						<NumberValue
							value={userOperationsCount0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'userOperationsCount')}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={erc4337BundlerTimestamp}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							userOperationsCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userOperationsCount = resolvedEntity.userOperationsCount}
					{#if userOperationsCount !== undefined && userOperationsCount !== null}
						<div>
							<dt>User operations</dt>
							<dd>
								<NumberValue
									value={userOperationsCount}
								/>
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
							(
								selection.entitySelector.$bundler != null && 'address' in selection.entitySelector.$bundler
								&& selection.entitySelector.$bundler.address != null
								&& selection.entitySelector.$bundler != null && '$network' in selection.entitySelector.$bundler ?
									selection.entitySelector.$bundler.$network != null && 'caip2' in selection.entitySelector.$bundler.$network
									&& selection.entitySelector.$bundler.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]', {
									address: String(selection.entitySelector.$bundler.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$bundler.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$bundler.$network != null && 'slug' in selection.entitySelector.$bundler.$network
										&& selection.entitySelector.$bundler.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]', {
										address: String(selection.entitySelector.$bundler.address ?? ''),
										network: String(selection.entitySelector.$bundler.$network.slug ?? ''),
									})
									:
										undefined
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
	{/snippet}
</EntityView>
