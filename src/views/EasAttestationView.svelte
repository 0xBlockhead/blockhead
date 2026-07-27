<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.EasAttestation> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
			Source.EasContracts_Evm,
			Source.EasScan_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const easAttestation = $derived(viewSelection({
		fields: {
			schemaUid: true,
			recipient: true,
			attester: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.uid ?? '') || 'EAS attestation')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.uid ?? '') || 'EAS attestation'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$schema}
		>
			{#snippet children(easSchema)}
				{#if easSchema != null}
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

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={easAttestation}>
			{#snippet children(entity)}
				<span data-text="muted">
					{String(entity.recipient)}
				</span>

				<span data-text="muted">
					{String(entity.attester)}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>UID</dt>
				<dd>
					{String(pendingEntity.uid)}
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
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
							{String(entity.schemaUid)}
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
							{String(entity.recipient)}
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
							{String(entity.attester)}
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
								{String(refUid)}
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
								<Timestamp timestamp={Number(attestedAt)} />
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
								<Timestamp timestamp={Number(expirationTime)} />
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
								{String(data)}
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
					{#if evmNetworkAccount != null}
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
				resource={selection.$attesterAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null}
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
				resource={selection.$refAttestation}
			>
				{#snippet children(easAttestation)}
					{#if easAttestation != null}
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
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
