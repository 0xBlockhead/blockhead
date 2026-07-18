<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadFedimintClientState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadFedimintClientState>>
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
	const blockheadFedimintClientState = $derived(selection({
		sources: selection.sources,
		fields: {
			clientName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.clientName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.clientId) ?? '')].filter(Boolean).join(' ') || 'blockhead Fedimint client state')
	const viewDomId = $derived('blockhead-fedimint-client-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadFedimintClientState_TimestampsView from '$/views/BlockheadFedimintClientState_TimestampsView.svelte'
	import FedimintFederationView from '$/views/FedimintFederationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFedimintClientState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.clientName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadFedimintClientState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.clientName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.federationId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.clientName) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadFedimintClientState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.federationId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.clientName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									clientId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const clientId = resolvedEntity.clientId}
							{#if clientId !== undefined && clientId !== null}
								{String((clientId) ?? '')}
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
							clientName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientName = resolvedEntity.clientName}
					{#if clientName !== undefined && clientName !== null}
						<div>
							<dt>client name</dt>
							<dd>
								{String((clientName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>federation ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									federationId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const federationId = resolvedEntity.federationId}
							{#if federationId !== undefined && federationId !== null}
								{String((federationId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>federation</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$federation}
					>
						{#snippet children(fedimintFederation)}
							{#if fedimintFederation != null && fedimintFederation[EntityMetaKey.Selector] != null}
								<FedimintFederationView
									selection={select(EntityType.FedimintFederation, fedimintFederation[EntityMetaKey.Selector])}
									prefetched={fedimintFederation}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							inviteCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inviteCode = resolvedEntity.inviteCode}
					{#if inviteCode !== undefined && inviteCode !== null}
						<div>
							<dt>invite code</dt>
							<dd>
								{String((inviteCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							mnemonicSet: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mnemonicSet = resolvedEntity.mnemonicSet}
					{#if mnemonicSet !== undefined && mnemonicSet !== null}
						<div>
							<dt>mnemonic set</dt>
							<dd>
								{mnemonicSet ? 'Yes' : 'No'}
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
						sources: selection.sources,
						fields: {
							guardianThreshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const guardianThreshold = resolvedEntity.guardianThreshold}
					{#if guardianThreshold !== undefined && guardianThreshold !== null}
						<div>
							<dt>guardian threshold</dt>
							<dd>
								<NumberValue
									value={guardianThreshold}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							moduleConfigJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleConfigJson = resolvedEntity.moduleConfigJson}
					{#if moduleConfigJson !== undefined && moduleConfigJson !== null}
						<div>
							<dt>module config JSON</dt>
							<dd>
								{String((moduleConfigJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							joinedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const joinedAt = resolvedEntity.joinedAt}
					{#if joinedAt !== undefined && joinedAt !== null}
						<div>
							<dt>joined AT</dt>
							<dd>
								<Timestamp timestamp={Number(joinedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							viewingKeyJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const viewingKeyJson = resolvedEntity.viewingKeyJson}
					{#if viewingKeyJson !== undefined && viewingKeyJson !== null}
						<div>
							<dt>viewing key JSON</dt>
							<dd>
								{String((viewingKeyJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadFedimintClientState_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='BlockheadFedimintClientState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
