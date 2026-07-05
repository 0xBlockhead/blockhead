<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BnbValidator>>
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
	const bnbValidator = $derived(selection({
		fields: {
			moniker: true,
			consensusAddress: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.moniker) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.operatorAddress ?? prefetched.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'bnb validator')
	const viewDomId = $derived('bnb-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbValidator_TimestampsView from '$/views/BnbValidator_TimestampsView.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbValidator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbValidator}>
			{#snippet Pending()}
				{[String((prefetched.moniker) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.operatorAddress ?? prefetched.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'bnb validator'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.moniker) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbValidator}>
			{#snippet Pending()}
				{[String((prefetched.consensusAddress) ?? '')].filter(Boolean).join(' ') || [String((prefetched.moniker) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.operatorAddress ?? prefetched.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'bnb validator'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.consensusAddress) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.moniker) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operator address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operatorAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operatorAddress = selection.entitySelector.operatorAddress ?? prefetched.operatorAddress}
							{#if operatorAddress !== undefined && operatorAddress !== null}
								<TruncatedValue value={String((operatorAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operatorAddress = resolvedEntity.operatorAddress}
							{#if operatorAddress !== undefined && operatorAddress !== null}
								<TruncatedValue value={String((operatorAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consensusAddress = prefetched.consensusAddress}
					{#if consensusAddress !== undefined && consensusAddress !== null}
						<div>
							<dt>consensus address</dt>
							<dd>
								<TruncatedValue value={String((consensusAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusAddress = resolvedEntity.consensusAddress}
					{#if consensusAddress !== undefined && consensusAddress !== null}
						<div>
							<dt>consensus address</dt>
							<dd>
								<TruncatedValue value={String((consensusAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moniker: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moniker = prefetched.moniker}
					{#if moniker !== undefined && moniker !== null}
						<div>
							<dt>moniker</dt>
							<dd>
								{String((moniker) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moniker = resolvedEntity.moniker}
					{#if moniker !== undefined && moniker !== null}
						<div>
							<dt>moniker</dt>
							<dd>
								{String((moniker) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BnbValidator_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BnbValidator_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='BnbValidator_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
