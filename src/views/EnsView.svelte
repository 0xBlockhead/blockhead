<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { Entity, EntitySelector } from '$/schema/$schema.ts'

	import {
		ensCoinTypeLabelByKey,
		ensRegistrationStatusByStatus,
		ensTextRecords,
		EnsRegistrationStatus,
	} from '$/constants/Ens.ts'

	import { ChainId } from '$/constants/ChainId.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(explore)/(ens)/ens/name/[ensName]', {
			ensName: selection.entitySelector.name,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EnsName>
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
	import { select } from '$/routes/+layout.svelte'

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const

	const ens = $derived(
		selection(
			({ sources: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			], fields: {
				name: true,
				labelName: true,
				$subgraphResolvedActor: true,
				subdomainCount: true,
				textRecords: true,
				isMigrated: true,
				expiryDate: true,
				contentHash: true,
				...(open && {
					labelhash: true,
					subgraphId: true,
					$subgraphOwnerActor: true,
					$registrantActor: true,
					$wrappedOwnerActor: true,
					$parent: true,
					$$subdomains: true,
					coinAddresses: true,
					resolverAbi: true,
					resolverTextKeys: true,
					resolverCoinTypes: true,
					ttl: true,
					createdAt: true,
					wrappedExpiryDate: true,
					wrappedFuses: true,
					registrationDate: true,
					registrationCost: true,
					registrationExpiryDate: true,
				}),
			} }),
		)
	)


	// (Derived)
	const ensNameSelectorKey = $derived(
		stringify(selection.entitySelector),
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
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	title={selection.entitySelector.name}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={ens}
		>
			{#snippet children(ens)}
				{@const avatarRaw = ens.textRecords?.avatar?.trim()}
				{@const avatarUrl = (
					avatarRaw != null && avatarRaw !== '' ?
						resolveMediaUrlTransport(avatarRaw)?.url
					:
						undefined
				)}
				{#if avatarUrl}
					<Icon
						alt={selection.entitySelector.name}
						src={avatarUrl}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.name}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-text="font-monospace">
			{selection.entitySelector.name}
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
							{#if ens.$subgraphResolvedActor !== undefined}
								<a
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
										ensName: selection.entitySelector.name,
									})}
								>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={ens.$subgraphResolvedActor[EntityMetaKey.Selector].address}
									/>
								</a>
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
								ens.textRecords !== undefined
								&& Object.keys(ens.textRecords).length > 0
							)}
								{String(Object.keys(ens.textRecords).length)}
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
							{#if (ens.subdomainCount ?? 0) > 0}
								{String(ens.subdomainCount)}
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
								ens.coinAddresses !== undefined
								&& Object.keys(ens.coinAddresses).length > 0
							)}
								{String(Object.keys(ens.coinAddresses).length)}
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
								ens.expiryDate !== undefined
								&& Number.isFinite(Number(ens.expiryDate))
							)}
								{ensRegistrationStatusByStatus[
									(
										Date.now() < Number(ens.expiryDate) ?
											EnsRegistrationStatus.Active
										: Date.now() < Number(ens.expiryDate) + Number(90n * 24n * 60n * 60n) * 1000 ?
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
							{#if ens.contentHash != null && ens.contentHash !== ''}
								{@const decodedContentHash = decodeEnsContentHash(ens.contentHash)}
								{@const contentHashBrowseHref = ensContentHashBrowseHref(ens.contentHash)}
								<TruncatedValue
									value={ens.contentHash}
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
							{#if ens.isMigrated !== undefined}
								{ens.isMigrated ? 'Yes' : 'No'}
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
								{#if ens.$subgraphOwnerActor !== undefined}
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ChainId.Ethereum) } },
											$actor: ens.$subgraphOwnerActor[EntityMetaKey.Selector],
										})}
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
									ens.expiryDate !== undefined
									&& Number.isFinite(Number(ens.expiryDate))
								)}
									<Timestamp
										timestamp={Number(ens.expiryDate)}
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
					id={`${ensNameSelectorKey}:carousel-profile`}
					sectionIdPrefix={ensNameSelectorKey}
					sections={[
						...(
							ens.textRecords?.header?.trim() != null
							&& ens.textRecords?.header?.trim() !== ''
							&& resolveMediaUrlTransport(ens.textRecords?.header?.trim())?.url != null ?
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
						{@const headerRaw = ens.textRecords?.header?.trim()}
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
							selection={selection}
							id={`${id}-list`}
							recordKeys={ensTextRecords
								.filter((row) => row.profile)
								.map((row) => row.key)}
							title="ENSIP-18 profile records"
						/>
					{/snippet}
				</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameSelectorKey}:carousel-registration`}
					sectionIdPrefix={ensNameSelectorKey}
					sections={[
							...(ens.$$subdomains !== undefined && ens.$$subdomains.values.length > 0 ? [{ id: 'registration-subdomains', label: 'Subdomains' }] : []),
						...(ens.$parent !== undefined ? [{ id: 'registration-parent', label: 'Parent' }] : []),
						{ id: 'registration-metadata', label: 'Metadata' },
					...(ens.$registrantActor !== undefined || ens.$wrappedOwnerActor !== undefined ? [{ id: 'registration-accounts', label: 'Accounts' }] : []),
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
							{#if ens.$$subdomains !== undefined && ens.$$subdomains.values.length > 0}
							<EntitiesList
								collapsible={false}
								entityType={EntityType.EnsName}
							getKey={(subdomain) => subdomain.entitySelector.name}
							getSortValue={(subdomain) => subdomain.entitySelector.name}
								href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
									ensName: selection.entitySelector.name,
								})}
								id={`${id}-list`}
										items={ens.$$subdomains.values}
									title="Subdomains"
								>
							{#snippet Item({ item })}
								<a
									data-link
									href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
										ensName: item.entitySelector.name,
									})}
								>{item.entitySelector.name}</a>
							{/snippet}
						</EntitiesList>
					{/if}
				{/snippet}

				{#snippet SectionRegistrationParent({ id, label })}
					{#if ens.$parent !== undefined}
						{@const parentId = ens.$parent[EntityMetaKey.Selector]}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
							ensName: selection.entitySelector.name,
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
						{#if ens.$ownerActor !== undefined}
							<div>
								<dt>Registry owner</dt>
								<dd>
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ChainId.Ethereum) } },
											$actor: ens.$ownerActor[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.$subgraphOwnerActor !== undefined}
							<div>
								<dt>Subgraph owner</dt>
								<dd>
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ChainId.Ethereum) } },
											$actor: ens.$subgraphOwnerActor[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.$registrantActor !== undefined}
							<div>
								<dt>Registrant</dt>
								<dd>
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ChainId.Ethereum) } },
											$actor: ens.$registrantActor[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.$wrappedOwnerActor !== undefined}
							<div>
								<dt>Name wrapper owner</dt>
								<dd>
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: { caip2: { namespace: 'eip155' as const, reference: String(ChainId.Ethereum) } },
											$actor: ens.$wrappedOwnerActor[EntityMetaKey.Selector],
										})}
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
						{#if ens.subgraphId != null && ens.subgraphId !== ''}
							<div>
								<dt>Subgraph node id</dt>
								<dd>
									<TruncatedValue
										value={ens.subgraphId}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.name != null && ens.name !== selection.entitySelector.name}
							<div>
								<dt>Normalized name</dt>
								<dd>
									<span data-text="font-monospace">
										{ens.name}
									</span>
								</dd>
							</div>
						{/if}

						{#if ens.labelName != null && ens.labelName !== '' && ens.labelName !== selection.entitySelector.name}
							<div>
								<dt>Label</dt>
								<dd>{ens.labelName}</dd>
							</div>
						{/if}

						{#if ens.labelhash != null && ens.labelhash !== ''}
							<div>
								<dt>Labelhash</dt>
								<dd>
									<TruncatedValue
										value={ens.labelhash}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.ttl !== undefined}
							<div>
								<dt>TTL</dt>
								<dd>{String(ens.ttl)}</dd>
							</div>
						{/if}

						{#if (
							ens.createdAt !== undefined
							&& Number.isFinite(Number(ens.createdAt))
						)}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.createdAt)}
									/>
								</dd>
							</div>
						{/if}

						{#if (
							ens.registrationDate !== undefined
							&& Number.isFinite(Number(ens.registrationDate))
						)}
							<div>
								<dt>Registered</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.registrationDate)}
									/>
								</dd>
							</div>
						{/if}

						{#if (
							ens.registrationExpiryDate !== undefined
							&& Number.isFinite(Number(ens.registrationExpiryDate))
						)}
							<div>
								<dt>Registration expiry</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.registrationExpiryDate)}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.registrationCost !== undefined}
							<div>
								<dt>Registration cost</dt>
								<dd>
									<NumberValue value={ens.registrationCost} />
								</dd>
							</div>
						{/if}

						{#if (
							ens.wrappedExpiryDate !== undefined
							&& Number.isFinite(Number(ens.wrappedExpiryDate))
						)}
							<div>
								<dt>Wrapper expiry</dt>
								<dd>
									<Timestamp
										timestamp={Number(ens.wrappedExpiryDate)}
									/>
								</dd>
							</div>
						{/if}

						{#if ens.wrappedFuses !== undefined}
							<div>
								<dt>Wrapper fuses</dt>
								<dd>{String(ens.wrappedFuses)}</dd>
							</div>
						{/if}
					</div>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameSelectorKey}:carousel-records`}
				sectionIdPrefix={ensNameSelectorKey}
				sections={[
					{ id: 'records-text', label: 'Text records' },
						...(ens.contentHash != null && ens.contentHash !== '' ? [{ id: 'records-content-hash', label: 'Content hash' }] : []),
						...(ens.resolverAbi?.length ? [{ id: 'records-abi', label: 'Resolver ABI' }] : []),
						...(ens.coinAddresses !== undefined && Object.keys(ens.coinAddresses).length > 0 ? [{ id: 'records-coins', label: 'Coin addresses' }] : []),
						...(ens.resolverTextKeys?.values.length || ens.resolverCoinTypes?.values.length ? [{ id: 'records-indexer', label: 'Indexer' }] : []),
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
						selection={selection}
						excludeRecordKeys={ensTextRecords
							.filter((row) => row.profile)
							.map((row) => row.key)}
						id={`${id}-list`}
						title="General and social text records"
					/>
				{/snippet}

				{#snippet SectionRecordsContentHash({ id, label })}
					{#if ens.contentHash != null && ens.contentHash !== ''}
						{@const decodedContentHash = decodeEnsContentHash(ens.contentHash)}
						{@const contentHashBrowseHref = ensContentHashBrowseHref(ens.contentHash)}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: selection.entitySelector.name,
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
												value={ens.contentHash}
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
					{#if ens.resolverAbi?.length}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: selection.entitySelector.name,
							})}
							id={`${id}-list`}
							title="Resolver ABI"
						>
							{#snippet body({ open: _bodyOpen })}
								<div data-column-item="center">
									<EvmAbiView
										abi={ens.resolverAbi}
										emptyText="Resolver ABI record has no JSON ABI entries."
											/>
									</div>
							{/snippet}
						</EntitiesList>
					{/if}
				{/snippet}

				{#snippet SectionRecordsCoins({ id, label })}
					{#if ens.coinAddresses !== undefined && Object.keys(ens.coinAddresses).length > 0}
						{@const coinAddresses = ens.coinAddresses}
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: selection.entitySelector.name,
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
												<dt>{
													coinType in ensCoinTypeLabelByKey ?
														ensCoinTypeLabelByKey[coinType].label
													:
														`Coin type ${String(coinType)}`
												}</dt>
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
							{#if ens.resolverTextKeys?.values.length || ens.resolverCoinTypes?.values.length}
							<EntitiesList
							collapsible={false}
							entityType={EntityType.EnsName}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
								ensName: selection.entitySelector.name,
							})}
							id={`${id}-list`}
							title="Subgraph resolver index"
						>
								{#snippet body({ open: _bodyOpen })}
									<div data-column-item="center">
											{#if ens.resolverTextKeys?.values.length}
											<div>
												<dt>Text keys</dt>
												<dd data-text="muted">{ens.resolverTextKeys.values.join(', ')}</dd>
											</div>
										{/if}
											{#if ens.resolverCoinTypes?.values.length}
											<div>
												<dt>Coin types</dt>
												<dd data-text="muted">
												{ens.resolverCoinTypes.values.map((coinType: string) => (
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
				id={`${ensNameSelectorKey}:carousel-resolution`}
				sectionIdPrefix={ensNameSelectorKey}
				sections={[
					...(ens.$subgraphResolvedActor !== undefined ? [{ id: 'resolution-subgraph-addr', label: 'Subgraph addr' }] : []),
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

				{#snippet SectionResolutionSubgraphAddr({ id, label })}
					{#if ens.$subgraphResolvedActor !== undefined}
						<EvmAccountView
							selection={select(EntityType.EvmAccount, ens.$subgraphResolvedActor[EntityMetaKey.Selector])}
							href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
								ensName: selection.entitySelector.name,
							})}
							title="Resolved address (subgraph)"
							layout={EntityLayout.Summary}
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
