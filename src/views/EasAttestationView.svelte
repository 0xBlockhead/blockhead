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
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EasAttestation>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EasAttestation>
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
	const easAttestation = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			recipient: true,
			attester: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			schemaUid: true,
			recipient: true,
			attester: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.uid) ?? '')].filter(Boolean).join(' ') || 'EAS attestation')
	const viewDomId = $derived('eas-attestation-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EasAttestation_TimestampsView from '$/views/EasAttestation_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
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
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.uid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={easAttestation}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$schema}
				>
					{#snippet children(easSchema)}
						{#if easSchema != null && easSchema[EntityMetaKey.Selector] != null}
							<EasSchemaView
								selection={select(EntityType.EasSchema, easSchema[EntityMetaKey.Selector])}
								prefetched={easSchema}
								href=""
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
								sources: selection.sources,
								fields: {
									uid: true,
								},
							})
						}
					>
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
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
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
								sources: selection.sources,
								fields: {
									schemaUid: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									recipient: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									attester: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							refUid: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							attestedAt: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							expirationTime: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							revocable: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							data: true,
						},
					})
				}
			>
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
				resource={selection.$schema}
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
				resource={selection.$recipientAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Recipient account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									href={
										(
											evmNetworkAccount[EntityMetaKey.Selector] != null && '$actor' in evmNetworkAccount[EntityMetaKey.Selector]
											&& evmNetworkAccount[EntityMetaKey.Selector].$actor != null && 'address' in evmNetworkAccount[EntityMetaKey.Selector].$actor
											&& evmNetworkAccount[EntityMetaKey.Selector].$actor.address != null
											&& evmNetworkAccount[EntityMetaKey.Selector] != null && '$network' in evmNetworkAccount[EntityMetaKey.Selector] ?
												evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkAccount[EntityMetaKey.Selector].$network
												&& evmNetworkAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
												network: String(caip2StringFromValue(evmNetworkAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkAccount[EntityMetaKey.Selector].$network
													&& evmNetworkAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
													network: String(evmNetworkAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$attesterAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Attester account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									href={
										(
											evmNetworkAccount[EntityMetaKey.Selector] != null && '$actor' in evmNetworkAccount[EntityMetaKey.Selector]
											&& evmNetworkAccount[EntityMetaKey.Selector].$actor != null && 'address' in evmNetworkAccount[EntityMetaKey.Selector].$actor
											&& evmNetworkAccount[EntityMetaKey.Selector].$actor.address != null
											&& evmNetworkAccount[EntityMetaKey.Selector] != null && '$network' in evmNetworkAccount[EntityMetaKey.Selector] ?
												evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'caip2' in evmNetworkAccount[EntityMetaKey.Selector].$network
												&& evmNetworkAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
												network: String(caip2StringFromValue(evmNetworkAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													evmNetworkAccount[EntityMetaKey.Selector].$network != null && 'slug' in evmNetworkAccount[EntityMetaKey.Selector].$network
													&& evmNetworkAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(evmNetworkAccount[EntityMetaKey.Selector].$actor.address ?? ''),
													network: String(evmNetworkAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$refAttestation}
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
		{@const easAttestationEasAttestationTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={easAttestationEasAttestationTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<EasAttestation_TimestampsView
					selection={easAttestationEasAttestationTimestampsViewTimestampsResource}
					countResource={easAttestationEasAttestationTimestampsViewTimestampsResource.count}
					title='Timestamps'
					id='EasAttestation_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
