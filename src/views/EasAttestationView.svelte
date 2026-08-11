<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EasAttestation>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EasScan_Graphql,
		],
	}))
	const easAttestation = $derived(viewSelection({
		fields: {
			schemaUid: true,
			recipient: true,
			attester: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EasAttestation_TimestampsView from '$/views/EasAttestation_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EasSchemaView from '$/views/EasSchemaView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EasAttestationView from '$/views/EasAttestationView.svelte'
</script>


<EntityView
	entityType={EntityType.EasAttestation}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.uid || 'EAS attestation')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eas/attestation/[uid=zeroExHex]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					uid: selection.entitySelector.uid,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$schema}
		>
			{#snippet children(easSchema)}
				{#if easSchema != null}
					{@const easSchemaInitial = untrack(() => easSchema)}
					<EasSchemaView
						selection={select(EntityType.EasSchema, (easSchema ?? easSchemaInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={easAttestation}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.recipient}
				</span>

				<span data-text="muted">
					{entity.attester}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>UID</dt>
				<dd>
					{selection.entitySelector.uid}
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Schema UID</dt>
				<dd>
					<ResourceBoundary
						resource={easAttestation}
					>
						{#snippet children(entity)}
							{entity.schemaUid}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Recipient</dt>
				<dd>
					<ResourceBoundary
						resource={easAttestation}
					>
						{#snippet children(entity)}
							{entity.recipient}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Attester</dt>
				<dd>
					<ResourceBoundary
						resource={easAttestation}
					>
						{#snippet children(entity)}
							{entity.attester}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							refUid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const refUid = entity.refUid}
					{#if refUid != null}
						<div>
							<dt>Ref UID</dt>
							<dd>
								{refUid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							attestedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const attestedAt = entity.attestedAt}
					{#if attestedAt != null}
						<div>
							<dt>Attested at</dt>
							<dd>
								<Timestamp timestamp={attestedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expirationTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationTime = entity.expirationTime}
					{#if expirationTime != null}
						<div>
							<dt>Expiration time</dt>
							<dd>
								<Timestamp timestamp={expirationTime} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							revocable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revocable = entity.revocable}
					{#if revocable != null}
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
					viewSelection({
						fields: {
							data: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const data = entity.data}
					{#if data != null}
						<div>
							<dt>Data</dt>
							<dd>
								{data}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$schema}
			>
				{#snippet children(easSchema)}
					{#if easSchema != null}
						{@const easSchemaInitial = untrack(() => easSchema)}
						<div>
							<dt>Schema</dt>
							<dd>
								<EasSchemaView
									selection={select(EntityType.EasSchema, (easSchema ?? easSchemaInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
					{#if evmNetworkAccount != null}
						{@const evmNetworkAccountInitial = untrack(() => evmNetworkAccount)}
						<div>
							<dt>Recipient account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, (evmNetworkAccount ?? evmNetworkAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
					{#if evmNetworkAccount != null}
						{@const evmNetworkAccountInitial = untrack(() => evmNetworkAccount)}
						<div>
							<dt>Attester account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, (evmNetworkAccount ?? evmNetworkAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
					{#if easAttestation != null}
						{@const easAttestationInitial = untrack(() => easAttestation)}
						<div>
							<dt>Ref attestation</dt>
							<dd>
								<EasAttestationView
									selection={select(EntityType.EasAttestation, (easAttestation ?? easAttestationInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EasAttestation_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
