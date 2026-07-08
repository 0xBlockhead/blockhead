<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFedimintClientState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadFedimintClientState>>
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
		fields: {
			clientName: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.clientName) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.clientId ?? prefetched.clientId) ?? '')].filter(Boolean).join(' ') || 'blockhead Fedimint client state')
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
		<ResourceBoundary resource={blockheadFedimintClientState}>
			{#snippet Pending()}
				{[String((prefetched.clientName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.clientId ?? prefetched.clientId) ?? '')].filter(Boolean).join(' ') || 'blockhead Fedimint client state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.clientName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadFedimintClientState}>
			{#snippet Pending()}
				{[String((selection.entitySelector.federationId ?? prefetched.federationId) ?? '')].filter(Boolean).join(' ') || [String((prefetched.clientName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.clientId ?? prefetched.clientId) ?? '')].filter(Boolean).join(' ') || 'blockhead Fedimint client state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.federationId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.clientName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									clientId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const clientId = selection.entitySelector.clientId ?? prefetched.clientId}
							{#if clientId !== undefined && clientId !== null}
								{String((clientId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							clientName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientName = prefetched.clientName}
					{#if clientName !== undefined && clientName !== null}
						<div>
							<dt>client name</dt>
							<dd>
								{String((clientName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									federationId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const federationId = selection.entitySelector.federationId ?? prefetched.federationId}
							{#if federationId !== undefined && federationId !== null}
								{String((federationId) ?? '')}
							{/if}
						{/snippet}

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
							{#if fedimintFederation[EntityMetaKey.Selector] != null}
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
						fields: {
							inviteCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inviteCode = prefetched.inviteCode}
					{#if inviteCode !== undefined && inviteCode !== null}
						<div>
							<dt>invite code</dt>
							<dd>
								{String((inviteCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							mnemonicSet: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mnemonicSet = prefetched.mnemonicSet}
					{#if mnemonicSet !== undefined && mnemonicSet !== null}
						<div>
							<dt>mnemonic set</dt>
							<dd>
								{mnemonicSet ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							guardianThreshold: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const guardianThreshold = prefetched.guardianThreshold}
					{#if guardianThreshold !== undefined && guardianThreshold !== null}
						<div>
							<dt>guardian threshold</dt>
							<dd>
								<NumberValue value={Number(guardianThreshold)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const guardianThreshold = resolvedEntity.guardianThreshold}
					{#if guardianThreshold !== undefined && guardianThreshold !== null}
						<div>
							<dt>guardian threshold</dt>
							<dd>
								<NumberValue value={Number(guardianThreshold)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleConfigJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moduleConfigJson = prefetched.moduleConfigJson}
					{#if moduleConfigJson !== undefined && moduleConfigJson !== null}
						<div>
							<dt>module config JSON</dt>
							<dd>
								{String((moduleConfigJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							joinedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const joinedAt = prefetched.joinedAt}
					{#if joinedAt !== undefined && joinedAt !== null}
						<div>
							<dt>joined AT</dt>
							<dd>
								<Timestamp timestamp={Number(joinedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							viewingKeyJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const viewingKeyJson = prefetched.viewingKeyJson}
					{#if viewingKeyJson !== undefined && viewingKeyJson !== null}
						<div>
							<dt>viewing key JSON</dt>
							<dd>
								{String((viewingKeyJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No observations yet.'
				id='BlockheadFedimintClientState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
