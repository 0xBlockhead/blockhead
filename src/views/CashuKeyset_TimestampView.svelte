<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: RegisteredEntityProxyResource<EntityType.CashuKeyset_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CashuKeyset_Timestamp>>
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
	const cashuKeysetTimestamp = $derived(selection({
		fields: {
			active: true,
			inputFeePpk: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Cashu keyset timestamp')
	const viewDomId = $derived('cashu-keyset-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CashuKeysetView from '$/views/CashuKeysetView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuKeyset_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cashuKeysetTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
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
		<ResourceBoundary resource={cashuKeysetTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.active) ?? ''), String((pendingEntity.inputFeePpk) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'Cashu keyset timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.active) ?? ''), String((resolvedEntity.inputFeePpk) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>keyset</dt>
				<dd>
					<CashuKeysetView
						selection={select(EntityType.CashuKeyset, selection.entitySelector.$keyset, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const active = pendingEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							inputFeePpk: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputFeePpk = pendingEntity.inputFeePpk}
					{#if inputFeePpk !== undefined && inputFeePpk !== null}
						<div>
							<dt>input fee ppk</dt>
							<dd>
								<NumberValue value={Number(inputFeePpk)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputFeePpk = resolvedEntity.inputFeePpk}
					{#if inputFeePpk !== undefined && inputFeePpk !== null}
						<div>
							<dt>input fee ppk</dt>
							<dd>
								<NumberValue value={Number(inputFeePpk)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalExpiryMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const finalExpiryMs = pendingEntity.finalExpiryMs}
					{#if finalExpiryMs !== undefined && finalExpiryMs !== null}
						<div>
							<dt>final expiry ms</dt>
							<dd>
								<Timestamp timestamp={Number(finalExpiryMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalExpiryMs = resolvedEntity.finalExpiryMs}
					{#if finalExpiryMs !== undefined && finalExpiryMs !== null}
						<div>
							<dt>final expiry ms</dt>
							<dd>
								<Timestamp timestamp={Number(finalExpiryMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							listedByKeysEndpoint: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const listedByKeysEndpoint = pendingEntity.listedByKeysEndpoint}
					{#if listedByKeysEndpoint !== undefined && listedByKeysEndpoint !== null}
						<div>
							<dt>listed by keys endpoint</dt>
							<dd>
								{listedByKeysEndpoint ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const listedByKeysEndpoint = resolvedEntity.listedByKeysEndpoint}
					{#if listedByKeysEndpoint !== undefined && listedByKeysEndpoint !== null}
						<div>
							<dt>listed by keys endpoint</dt>
							<dd>
								{listedByKeysEndpoint ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							listedByKeysetsEndpoint: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const listedByKeysetsEndpoint = pendingEntity.listedByKeysetsEndpoint}
					{#if listedByKeysetsEndpoint !== undefined && listedByKeysetsEndpoint !== null}
						<div>
							<dt>listed by keysets endpoint</dt>
							<dd>
								{listedByKeysetsEndpoint ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const listedByKeysetsEndpoint = resolvedEntity.listedByKeysetsEndpoint}
					{#if listedByKeysetsEndpoint !== undefined && listedByKeysetsEndpoint !== null}
						<div>
							<dt>listed by keysets endpoint</dt>
							<dd>
								{listedByKeysetsEndpoint ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
