<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadFedimintClientState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const blockheadFedimintClientState = $derived(selection({
		fields: {
			clientName: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.clientName ?? '') || (pendingEntity.clientId ?? '') || 'blockhead Fedimint client state')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadFedimintClientState_TimestampsView from '$/views/BlockheadFedimintClientState_TimestampsView.svelte'
	import FedimintFederationView from '$/views/FedimintFederationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFedimintClientState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadFedimintClientState}>
			{#snippet children(entity)}
				{(entity.clientName ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.federationId ?? '') || (pendingEntity.clientName ?? '') || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client ID</dt>
				<dd>
					{pendingEntity.clientId}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadFedimintClientState}
			>
				{#snippet children(entity)}
					{@const clientName = entity.clientName}
					{#if clientName != null}
						<div>
							<dt>client name</dt>
							<dd>
								{clientName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>federation ID</dt>
				<dd>
					{pendingEntity.federationId}
				</dd>
			</div>

			<div>
				<dt>federation</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$federation}
					>
						{#snippet children(fedimintFederation)}
							<FedimintFederationView
								selection={select(EntityType.FedimintFederation, fedimintFederation[EntityMetaKey.Selector])}
								prefetched={fedimintFederation}
								layout={EntityLayout.Value}
								open={false}
							/>
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
				{#snippet children(entity)}
					{@const inviteCode = entity.inviteCode}
					{#if inviteCode != null}
						<div>
							<dt>invite code</dt>
							<dd>
								{inviteCode}
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
				{#snippet children(entity)}
					{@const mnemonicSet = entity.mnemonicSet}
					{#if mnemonicSet != null}
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
				{#snippet children(entity)}
					{@const guardianThreshold = entity.guardianThreshold}
					{#if guardianThreshold != null}
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
						fields: {
							moduleConfigJson: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleConfigJson = entity.moduleConfigJson}
					{#if moduleConfigJson != null}
						<div>
							<dt>module config JSON</dt>
							<dd>
								{moduleConfigJson}
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
				{#snippet children(entity)}
					{@const joinedAt = entity.joinedAt}
					{#if joinedAt != null}
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
				{#snippet children(entity)}
					{@const viewingKeyJson = entity.viewingKeyJson}
					{#if viewingKeyJson != null}
						<div>
							<dt>viewing key JSON</dt>
							<dd>
								{viewingKeyJson}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadFedimintClientStateBlockheadFedimintClientStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadFedimintClientStateBlockheadFedimintClientStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadFedimintClientState_TimestampsView
						selection={blockheadFedimintClientStateBlockheadFedimintClientStateTimestampsViewTimestampsResource}
						countResource={blockheadFedimintClientStateBlockheadFedimintClientStateTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
