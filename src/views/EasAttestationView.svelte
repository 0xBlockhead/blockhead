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
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EasAttestation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EasAttestation>>
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
	const easAttestation = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
			Source.EasContracts_Evm,
			Source.EasScan_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			schemaUid: true,
			recipient: true,
			attester: true,
			$schema: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.uid ?? prefetched.uid) ?? '')].filter(Boolean).join(' ') || 'EAS attestation')
	const viewDomId = $derived('eas-attestation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EasAttestation_TimestampsView from '$/views/EasAttestation_TimestampsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EasSchemaView from '$/views/EasSchemaView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EasAttestationView from '$/views/EasAttestationView.svelte'
</script>


<EntityView
	entityType={EntityType.EasAttestation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={easAttestation}>
			{#snippet Pending()}
				{[String((selection.entitySelector.uid ?? prefetched.uid) ?? '')].filter(Boolean).join(' ') || title || 'EAS attestation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.uid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={easAttestation}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.EasSchema, false>('$schema')}
				>
					{#snippet children(easSchema)}
						{#if easSchema != null && easSchema[EntityMetaKey.Selector] != null}
							<EasSchemaView
								selection={select(EntityType.EasSchema, easSchema[EntityMetaKey.Selector])}
								prefetched={easSchema}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.EasSchema, false>('$schema')}
				>
					{#snippet children(easSchema)}
						{#if easSchema != null && easSchema[EntityMetaKey.Selector] != null}
							<EasSchemaView
								selection={select(EntityType.EasSchema, easSchema[EntityMetaKey.Selector])}
								prefetched={easSchema}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={easAttestation}>
			{#snippet Pending()}
				{@const recipient0 = prefetched.recipient}
				{#if recipient0 !== undefined && recipient0 !== null}
					<span data-text="muted">
						{String((recipient0) ?? '')}
					</span>
				{/if}
				{@const attester1 = prefetched.attester}
				{#if attester1 !== undefined && attester1 !== null}
					<span data-text="muted">
						{String((attester1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const recipient0 = resolvedEntity.recipient}
				{#if recipient0 !== undefined && recipient0 !== null}
					<span data-text="muted">
						{String((recipient0) ?? '')}
					</span>
				{/if}
				{@const attester1 = resolvedEntity.attester}
				{#if attester1 !== undefined && attester1 !== null}
					<span data-text="muted">
						{String((attester1) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>UID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									uid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const uid = selection.entitySelector.uid ?? prefetched.uid}
							{#if uid !== undefined && uid !== null}
								{String((uid) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const uid = resolvedEntity.uid}
							{#if uid !== undefined && uid !== null}
								{String((uid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Schema UID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									schemaUid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const schemaUid = prefetched.schemaUid}
							{#if schemaUid !== undefined && schemaUid !== null}
								{String((schemaUid) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const schemaUid = resolvedEntity.schemaUid}
							{#if schemaUid !== undefined && schemaUid !== null}
								{String((schemaUid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Recipient</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									recipient: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const recipient = prefetched.recipient}
							{#if recipient !== undefined && recipient !== null}
								{String((recipient) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const recipient = resolvedEntity.recipient}
							{#if recipient !== undefined && recipient !== null}
								{String((recipient) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Attester</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									attester: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const attester = prefetched.attester}
							{#if attester !== undefined && attester !== null}
								{String((attester) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const attester = resolvedEntity.attester}
							{#if attester !== undefined && attester !== null}
								{String((attester) ?? '')}
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
							refUid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const refUid = prefetched.refUid}
					{#if refUid !== undefined && refUid !== null}
						<div>
							<dt>Ref UID</dt>
							<dd>
								{String((refUid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const refUid = resolvedEntity.refUid}
					{#if refUid !== undefined && refUid !== null}
						<div>
							<dt>Ref UID</dt>
							<dd>
								{String((refUid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							attestedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const attestedAt = prefetched.attestedAt}
					{#if attestedAt !== undefined && attestedAt !== null}
						<div>
							<dt>Attested at</dt>
							<dd>
								<Timestamp timestamp={Number(attestedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const attestedAt = resolvedEntity.attestedAt}
					{#if attestedAt !== undefined && attestedAt !== null}
						<div>
							<dt>Attested at</dt>
							<dd>
								<Timestamp timestamp={Number(attestedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expirationTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expirationTime = prefetched.expirationTime}
					{#if expirationTime !== undefined && expirationTime !== null}
						<div>
							<dt>Expiration time</dt>
							<dd>
								<Timestamp timestamp={Number(expirationTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationTime = resolvedEntity.expirationTime}
					{#if expirationTime !== undefined && expirationTime !== null}
						<div>
							<dt>Expiration time</dt>
							<dd>
								<Timestamp timestamp={Number(expirationTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							revocable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revocable = prefetched.revocable}
					{#if revocable !== undefined && revocable !== null}
						<div>
							<dt>Revocable</dt>
							<dd>
								{revocable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revocable = resolvedEntity.revocable}
					{#if revocable !== undefined && revocable !== null}
						<div>
							<dt>Revocable</dt>
							<dd>
								{revocable ? 'Yes' : 'No'}
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
							data: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const data = prefetched.data}
					{#if data !== undefined && data !== null}
						<div>
							<dt>Data</dt>
							<dd>
								{String((data) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const data = resolvedEntity.data}
					{#if data !== undefined && data !== null}
						<div>
							<dt>Data</dt>
							<dd>
								{String((data) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EasSchema, false>('$schema')}
			>
				{#snippet children(easSchema)}
					{#if easSchema != null && easSchema[EntityMetaKey.Selector] != null}
						<div>
							<dt>Schema</dt>
							<dd>
								<EasSchemaView
									selection={select(EntityType.EasSchema, easSchema[EntityMetaKey.Selector])}
									prefetched={easSchema}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetworkAccount, false>('$recipientAccount')}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Recipient account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetworkAccount, false>('$attesterAccount')}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Attester account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EasAttestation, false>('$refAttestation')}
			>
				{#snippet children(easAttestation)}
					{#if easAttestation != null && easAttestation[EntityMetaKey.Selector] != null}
						<div>
							<dt>Ref attestation</dt>
							<dd>
								<EasAttestationView
									selection={select(EntityType.EasAttestation, easAttestation[EntityMetaKey.Selector])}
									prefetched={easAttestation}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EasAttestation_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EasAttestation_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No EAS attestation observations.'
				id='EasAttestation_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
