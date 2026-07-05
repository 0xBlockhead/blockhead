<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.RegulatedAssetProfile_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RegulatedAssetProfile_Timestamp>>
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
	const regulatedAssetProfileTimestamp = $derived(selection({}))
	const titleFallback = $derived('regulated asset profile timestamp')
	const viewDomId = $derived('regulated-asset-profile-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.RegulatedAssetProfile_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={regulatedAssetProfileTimestamp}>
			{#snippet Pending()}
				{title || 'regulated asset profile timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>profile</dt>
				<dd>
					<RegulatedAssetProfileView
						selection={select(EntityType.RegulatedAssetProfile, selection.entitySelector.$profile)}
						layout={EntityLayout.Title}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCoordinateKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerCoordinateKind = prefetched.ledgerCoordinateKind}
					{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
						<div>
							<dt>ledger coordinate kind</dt>
							<dd>
								{String((ledgerCoordinateKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerCoordinateKind = resolvedEntity.ledgerCoordinateKind}
					{#if ledgerCoordinateKind !== undefined && ledgerCoordinateKind !== null}
						<div>
							<dt>ledger coordinate kind</dt>
							<dd>
								{String((ledgerCoordinateKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCoordinateValue: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerCoordinateValue = prefetched.ledgerCoordinateValue}
					{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
						<div>
							<dt>ledger coordinate value</dt>
							<dd>
								{String((ledgerCoordinateValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerCoordinateValue = resolvedEntity.ledgerCoordinateValue}
					{#if ledgerCoordinateValue !== undefined && ledgerCoordinateValue !== null}
						<div>
							<dt>ledger coordinate value</dt>
							<dd>
								{String((ledgerCoordinateValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paused: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paused = prefetched.paused}
					{#if paused !== undefined && paused !== null}
						<div>
							<dt>paused</dt>
							<dd>
								{paused ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paused = resolvedEntity.paused}
					{#if paused !== undefined && paused !== null}
						<div>
							<dt>paused</dt>
							<dd>
								{paused ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							registryVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registryVersion = prefetched.registryVersion}
					{#if registryVersion !== undefined && registryVersion !== null}
						<div>
							<dt>registry version</dt>
							<dd>
								{String((registryVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryVersion = resolvedEntity.registryVersion}
					{#if registryVersion !== undefined && registryVersion !== null}
						<div>
							<dt>registry version</dt>
							<dd>
								{String((registryVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$identityRegistry')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>identity registry</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace ?? '')}:${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference ?? '')}`,
											address: String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$compliance')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>compliance</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace ?? '')}:${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference ?? '')}`,
											address: String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$trustedIssuersRegistry')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>trusted issuers registry</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace ?? '')}:${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference ?? '')}`,
											address: String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$claimTopicsRegistry')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>claim topics registry</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace ?? '')}:${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference ?? '')}`,
											address: String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
