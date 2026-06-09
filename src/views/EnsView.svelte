<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { Entity, EntityId } from '$/schema/$schema.ts'

	import {
		ensCoinTypeLabelByKey,
		ensGracePeriodSeconds,
		ensProfileTextRecordKeys,
		ensRegistrationStatusByStatus,
		EnsRegistrationStatus,
	} from '$/constants/Ens.ts'

	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ensEthereumChainId } from '$/constants/Ens.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(explore)/(ens)/ens/name/[ensName]', {
			ensName: entityId.name,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EnsName>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	import {
		decodeEnsContentHash,
		ensContentHashBrowseHref,
	} from '$/lib/ensContentHash.ts'

	import { resolveMediaUrlTransport } from '$/lib/media.ts'
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const

	const ens = useEntity(entityCollectionsContext, EntityType.EnsName,
		entityId,
		({ sources: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			], fields: { name: true, labelName: true, $resolvedActor: true, $subgraphResolvedActor: true, subdomainCount: true, textRecords: true, isMigrated: true, expiryDate: true, contentHash: true, ...(open ? ({ labelhash: true, subgraphId: true, $resolverContract: true, $ownerActor: true, $subgraphOwnerActor: true, $registrantActor: true, $wrappedOwnerActor: true, $parent: true, $$subdomains: true, coinAddresses: true, resolverAbi: true, resolverTextKeys: true, resolverCoinTypes: true, ttl: true, createdAt: true, wrappedExpiryDate: true, wrappedFuses: true, registrationDate: true, registrationCost: true, registrationExpiryDate: true }) : ({  })) } }),
	)


	// (Derived)
	const ensNameIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Icon from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmAbiView from '$/views/EvmAbiView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	href={href}
	{layout}
	bind:open
	title={entityId.name}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={ens}
		>
			{#snippet children(ens)}
				{@const avatarRaw = ens.fields.textRecords?.avatar?.trim()}
				{@const avatarUrl = (
					avatarRaw != null && avatarRaw !== '' ?
						resolveMediaUrlTransport(avatarRaw)?.url
					:
						undefined
				)}
				{#if avatarUrl}
					<Icon
						alt={entityId.name}
						src={avatarUrl}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.name}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-text="font-monospace">
			{entityId.name}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ENS names map human-readable labels to resolver contracts on Ethereum mainnet; forward <code>addr</code> and <code>text</code> records live on the active resolver.
		</p>
		<p>
			Voltaire JSON-RPC ensNames reflect live registry reads; The Graph ensNames add registration, wrapper, and indexer metadata that may lag or differ from chain head.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Resolved address</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if ens.fields.$resolvedActor !== undefined}
								<EvmAccountView
									entityId={ens.fields.$resolvedActor[EntityMetaKey.Id]}
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
										ensName: entityId.name,
									})}
									layout={EntityLayout.Value}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Text records</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if (
								ens.fields.textRecords !== undefined
								&& Object.keys(ens.fields.textRecords).length > 0
							)}
								{String(Object.keys(ens.fields.textRecords).length)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Subdomains</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if (ens.fields.subdomainCount ?? 0) > 0}
								{String(ens.fields.subdomainCount)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Coin records</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if (
								ens.fields.coinAddresses !== undefined
								&& Object.keys(ens.fields.coinAddresses).length > 0
							)}
								{String(Object.keys(ens.fields.coinAddresses).length)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Registration</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if (
								ens.fields.expiryDate !== undefined
								&& Number.isFinite(Number(ens.fields.expiryDate))
							)}
								{ensRegistrationStatusByStatus[
									(
										Date.now() < Number(ens.fields.expiryDate) ?
											EnsRegistrationStatus.Active
										: Date.now() < Number(ens.fields.expiryDate) + Number(ensGracePeriodSeconds) * 1000 ?
											EnsRegistrationStatus.GracePeriod
										:
											EnsRegistrationStatus.Expired
									)
								].label}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Content hash</dt>
				<dd data-column="gap-1">
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if ens.fields.contentHash != null && ens.fields.contentHash !== ''}
								{@const decodedContentHash = decodeEnsContentHash(ens.fields.contentHash)}
								{@const contentHashBrowseHref = ensContentHashBrowseHref(ens.fields.contentHash)}
								<TruncatedValue
									value={ens.fields.contentHash}
									format={TruncatedValueFormat.Visual}
								/>
								{#if decodedContentHash != null}
									<span data-text="muted">
										{#if contentHashBrowseHref != null}
											<a data-link href={contentHashBrowseHref}>
												{decodedContentHash.canonicalUri}
											</a>
										{:else}
											{decodedContentHash.canonicalUri}
										{/if}
									</span>
								{/if}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Migrated</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if ens.fields.isMigrated !== undefined}
								{ens.fields.isMigrated ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Owner</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading ENS name…"
							resource={ens}
						>
							{#snippet children(ens)}
								{#if ens.fields.$ownerActor !== undefined}
									<EvmNetworkAccountView
										entityId={{
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ensEthereumChainId) } },
											$actor: ens.fields.$ownerActor[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Expiry</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading ENS name…"
							resource={ens}
						>
							{#snippet children(ens)}
								{#if (
									ens.fields.expiryDate !== undefined
									&& Number.isFinite(Number(ens.fields.expiryDate))
								)}
									<Timestamp
										timestamp={Number(ens.fields.expiryDate)}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open })}
		<ResourceBoundary resource={ens}>
			{#snippet children(ens)}
				<CollapsibleTabs
					id={`${ensNameIdKey}:carousel-profile`}
					sectionIdPrefix={ensNameIdKey}
					sections={[
						...(
							ens.fields.textRecords?.header?.trim() != null
							&& ens.fields.textRecords?.header?.trim() !== ''
							&& resolveMediaUrlTransport(ens.fields.textRecords?.header?.trim())?.url != null ?
								[{ id: 'profile-header', label: 'Header' }]
							:
								[]
						),
						{ id: 'profile-records', label: 'Profile records' },
					]}
					data-card
					class="ens-view-collapsible-profile"
					scrollContainerProps={entityViewDetailCarouselScrollProps}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Profile</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionProfileHeader({ id, label })}
						{@const headerRaw = ens.fields.textRecords?.header?.trim()}
						{@const headerUrl = (
							headerRaw != null && headerRaw !== '' ?
								resolveMediaUrlTransport(headerRaw)?.url
							:
								undefined
						)}
						{#if headerUrl != null}
							<img
								alt=""
								class="ens-view-profile-header"
								src={headerUrl}
							/>
						{/if}
					{/snippet}

					{#snippet SectionProfileRecords({ id, label })}
						<EnsNameTextRecordsView
							CollapsibleProps={{ canToggle: false }}
							entityId={entityId}
							id={`${id}-list`}
							recordKeys={[...ensProfileTextRecordKeys]}
							title="ENSIP-18 profile records"
						/>
					{/snippet}
				</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameIdKey}:carousel-registration`}
				sectionIdPrefix={ensNameIdKey}
				sections={[
					...((ens.fields.$$subdomains?.values ?? []).length ? [{ id: 'registration-subdomains', label: 'Subdomains' }] : []),
					...(ens.fields.$parent !== undefined ? [{ id: 'registration-parent', label: 'Parent' }] : []),
					{ id: 'registration-metadata', label: 'Metadata' },
					...(ens.fields.$registrantActor !== undefined || ens.fields.$wrappedOwnerActor !== undefined ? [{ id: 'registration-accounts', label: 'Accounts' }] : []),
				]}
				data-card
				class="ens-view-collapsible-registration"
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Registration</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRegistrationSubdomains({ id, label })}
					{#if (ens.fields.$$subdomains?.values ?? []).length}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							getKey={(sub) => sub.name}
							getSortValue={(sub) => sub.name}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
								ensName: entityId.name,
							})}
							id={`${id}-list`}
								items={(ens.fields.$$subdomains?.values ?? []).map((subdomain: Entity<typeof schema, EntityType.EnsName>) => subdomain[EntityMetaKey.Id])}
								title="Subdomains"
							>
							{#snippet Item({ item })}
								<a
									data-link
									href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
										ensName: item.name,
									})}
								>{item.name}</a>
							{/snippet}
						</EntitiesList>
					{/if}
				{/snippet}

				{#snippet SectionRegistrationParent({ id, label })}
					{#if ens.fields.$parent !== undefined}
						{@const parentId = ens.fields.$parent[EntityMetaKey.Id]}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
							ensName: entityId.name,
						})}
							id={`${id}-list`}
							title="Parent name"
					>
							{#snippet body({ open: _bodyOpen })}
								<a
									data-link
									href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
										ensName: parentId.name,
									})}
								>{parentId.name}</a>
							{/snippet}
						</EntitiesList>
					{/if}
			{/snippet}

				{#snippet SectionRegistrationAccounts({ id, label })}
					<div data-column-item="center">
						{#if ens.fields.$ownerActor !== undefined}
							<div>
								<dt>Registry owner</dt>
								<dd>
									<EvmNetworkAccountView
										entityId={{
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ensEthereumChainId) } },
											$actor: ens.fields.$ownerActor[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.fields.$subgraphOwnerActor !== undefined}
							<div>
								<dt>Subgraph owner</dt>
								<dd>
									<EvmNetworkAccountView
										entityId={{
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ensEthereumChainId) } },
											$actor: ens.fields.$subgraphOwnerActor[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.fields.$registrantActor !== undefined}
							<div>
								<dt>Registrant</dt>
								<dd>
									<EvmNetworkAccountView
										entityId={{
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ensEthereumChainId) } },
											$actor: ens.fields.$registrantActor[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.fields.$wrappedOwnerActor !== undefined}
							<div>
								<dt>Name wrapper owner</dt>
								<dd>
									<EvmNetworkAccountView
										entityId={{
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ensEthereumChainId) } },
											$actor: ens.fields.$wrappedOwnerActor[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					</div>
				{/snippet}

				{#snippet SectionRegistrationMetadata({ id, label })}
					<div data-column-item="center">
						{#if ens.fields.subgraphId != null && ens.fields.subgraphId !== ''}
							<div>
								<dt>Subgraph node id</dt>
								<dd>
									<TruncatedValue
										value={ens.fields.subgraphId}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.fields.name != null && ens.fields.name !== entityId.name}
							<div>
								<dt>Normalized name</dt>
								<dd>
									<span data-text="font-monospace">
										{ens.fields.name}
									</span>
								</dd>
							</div>
						{/if}

						{#if ens.fields.labelName != null && ens.fields.labelName !== '' && ens.fields.labelName !== entityId.name}
							<div>
								<dt>Label</dt>
								<dd>{ens.fields.labelName}</dd>
							</div>
						{/if}

						{#if ens.fields.labelhash != null && ens.fields.labelhash !== ''}
							<div>
								<dt>Labelhash</dt>
								<dd>
									<TruncatedValue
										value={ens.fields.labelhash}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.fields.ttl !== undefined}
							<div>
								<dt>TTL</dt>
								<dd>{String(ens.fields.ttl)}</dd>
							</div>
						{/if}

						{#if (
							ens.fields.createdAt !== undefined
							&& Number.isFinite(Number(ens.fields.createdAt))
						)}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.fields.createdAt)}
									/>
								</dd>
							</div>
						{/if}

						{#if (
							ens.fields.registrationDate !== undefined
							&& Number.isFinite(Number(ens.fields.registrationDate))
						)}
							<div>
								<dt>Registered</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.fields.registrationDate)}
									/>
								</dd>
							</div>
						{/if}

						{#if (
							ens.fields.registrationExpiryDate !== undefined
							&& Number.isFinite(Number(ens.fields.registrationExpiryDate))
						)}
							<div>
								<dt>Registration expiry</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.fields.registrationExpiryDate)}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.fields.registrationCost !== undefined}
							<div>
								<dt>Registration cost</dt>
								<dd>
									<NumberValue value={ens.fields.registrationCost} />
								</dd>
							</div>
						{/if}

						{#if (
							ens.fields.wrappedExpiryDate !== undefined
							&& Number.isFinite(Number(ens.fields.wrappedExpiryDate))
						)}
							<div>
								<dt>Wrapper expiry</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.fields.wrappedExpiryDate)}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.fields.wrappedFuses !== undefined}
							<div>
								<dt>Wrapper fuses</dt>
								<dd>{String(ens.fields.wrappedFuses)}</dd>
							</div>
						{/if}
					</div>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameIdKey}:carousel-records`}
				sectionIdPrefix={ensNameIdKey}
				sections={[
					{ id: 'records-text', label: 'Text records' },
					...(ens.fields.contentHash != null && ens.fields.contentHash !== '' ? [{ id: 'records-content-hash', label: 'Content hash' }] : []),
					...(ens.fields.resolverAbi?.length ? [{ id: 'records-abi', label: 'Resolver ABI' }] : []),
					...(ens.fields.coinAddresses !== undefined && Object.keys(ens.fields.coinAddresses).length > 0 ? [{ id: 'records-coins', label: 'Coin addresses' }] : []),
					...((ens.fields.resolverTextKeys?.values ?? []).length || (ens.fields.resolverCoinTypes?.values ?? []).length ? [{ id: 'records-indexer', label: 'Indexer' }] : []),
				]}
				data-card
				class="ens-view-collapsible-records"
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Records</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRecordsText({ id, label })}
					<EnsNameTextRecordsView
						CollapsibleProps={{ canToggle: false }}
						entityId={entityId}
						excludeRecordKeys={[...ensProfileTextRecordKeys]}
						id={`${id}-list`}
						title="General and social text records"
					/>
				{/snippet}

				{#snippet SectionRecordsContentHash({ id, label })}
					{#if ens.fields.contentHash != null && ens.fields.contentHash !== ''}
						{@const decodedContentHash = decodeEnsContentHash(ens.fields.contentHash)}
						{@const contentHashBrowseHref = ensContentHashBrowseHref(ens.fields.contentHash)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: entityId.name,
							})}
							id={`${id}-list`}
							title="Content hash"
						>
							{#snippet body({ open: _bodyOpen })}
								<div data-column-item="center">
									<div>
										<dt>Encoded</dt>
										<dd>
											<TruncatedValue
												value={ens.fields.contentHash}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
										</div>
										{#if decodedContentHash != null}
											<p>
												{#if contentHashBrowseHref != null}
													<a data-link href={contentHashBrowseHref}>
														<TruncatedValue
															value={decodedContentHash.canonicalUri}
															format={TruncatedValueFormat.Visual}
														/>
													</a>
												{:else}
													<TruncatedValue
														value={decodedContentHash.canonicalUri}
														format={TruncatedValueFormat.Visual}
													/>
												{/if}
											</p>
										{/if}
									</div>
							{/snippet}
						</EntitiesList>
					{/if}
				{/snippet}

				{#snippet SectionRecordsAbi({ id, label })}
					{#if ens.fields.resolverAbi?.length}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: entityId.name,
							})}
							id={`${id}-list`}
							title="Resolver ABI"
						>
							{#snippet body({ open: _bodyOpen })}
								<div data-column-item="center">
									<EvmAbiView
										abi={ens.fields.resolverAbi}
										emptyText="Resolver ABI record has no JSON ABI entries."
											/>
									</div>
							{/snippet}
						</EntitiesList>
					{/if}
				{/snippet}

				{#snippet SectionRecordsCoins({ id, label })}
					{#if ens.fields.coinAddresses !== undefined && Object.keys(ens.fields.coinAddresses).length > 0}
						{@const coinAddresses = ens.fields.coinAddresses}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: entityId.name,
							})}
							id={`${id}-list`}
							title="Coin addresses"
						>
							{#snippet body({ open: _bodyOpen })}
								<div data-column-item="center">
									{#each Object.keys(coinAddresses) as coinType (coinType)}
										{@const coinAddress = coinAddresses[coinType]}
										{#if coinAddress !== undefined}
											<div>
												<dt>{(
													coinType in ensCoinTypeLabelByKey ?
														ensCoinTypeLabelByKey[coinType].label
													:
														`Coin type ${String(coinType)}`
												)}</dt>
												<dd>
													<TruncatedValue
														value={coinAddress}
														format={TruncatedValueFormat.Visual}
													/>
												</dd>
											</div>
										{/if}
									{/each}
								</div>
							{/snippet}
						</EntitiesList>
				{/if}
			{/snippet}

				{#snippet SectionRecordsIndexer({ id, label })}
					{#if (ens.fields.resolverTextKeys?.values ?? []).length || (ens.fields.resolverCoinTypes?.values ?? []).length}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: entityId.name,
							})}
							id={`${id}-list`}
							title="Subgraph resolver index"
						>
							{#snippet body({ open: _bodyOpen })}
								<div data-column-item="center">
									{#if (ens.fields.resolverTextKeys?.values ?? []).length}
										<div>
											<dt>Text keys</dt>
											<dd data-text="muted">{(ens.fields.resolverTextKeys?.values ?? []).join(', ')}</dd>
										</div>
									{/if}
									{#if (ens.fields.resolverCoinTypes?.values ?? []).length}
										<div>
											<dt>Coin types</dt>
											<dd data-text="muted">
												{(ens.fields.resolverCoinTypes?.values ?? []).map((coinType: string) => (
													coinType in ensCoinTypeLabelByKey ?
														ensCoinTypeLabelByKey[coinType].label
													:
														`Coin type ${coinType}`
												)).join(', ')}
											</dd>
										</div>
									{/if}
								</div>
							{/snippet}
						</EntitiesList>
					{/if}
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameIdKey}:carousel-resolution`}
				sectionIdPrefix={ensNameIdKey}
				sections={[
					...(ens.fields.$resolvedActor !== undefined ? [{ id: 'resolution-addr', label: 'Addr record' }] : []),
					...(ens.fields.$subgraphResolvedActor !== undefined ? [{ id: 'resolution-subgraph-addr', label: 'Subgraph addr' }] : []),
					...(ens.fields.$resolverContract !== undefined ? [{ id: 'resolution-resolver', label: 'Resolver' }] : []),
				]}
				data-card
				class="ens-view-collapsible-resolution"
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Resolution</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionResolutionAddr({ id, label })}
					{#if ens.fields.$resolvedActor !== undefined}
						<EvmAccountView
							entityId={ens.fields.$resolvedActor[EntityMetaKey.Id]}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
								ensName: entityId.name,
							})}
							title="Addr record (RPC)"
						/>
					{/if}
				{/snippet}

				{#snippet SectionResolutionSubgraphAddr({ id, label })}
					{#if ens.fields.$subgraphResolvedActor !== undefined}
						<EvmAccountView
							entityId={ens.fields.$subgraphResolvedActor[EntityMetaKey.Id]}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
								ensName: entityId.name,
							})}
							title="Resolved address (subgraph)"
						/>
					{/if}
				{/snippet}

				{#snippet SectionResolutionResolver({ id, label })}
					{#if ens.fields.$resolverContract !== undefined}
						<EvmContractView
							entityId={ens.fields.$resolverContract[EntityMetaKey.Id]}
							title="Resolver contract"
						/>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>


<style>
	.ens-view-profile-header {
		block-size: 8rem;
		inline-size: 100%;
		object-fit: cover;
		border-radius: var(--card-radius, 0.5rem);
	}

</style>
