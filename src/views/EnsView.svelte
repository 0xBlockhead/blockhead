<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'

	import {
		ensCoinTypeLabels,
		ensGracePeriodSeconds,
		ensProfileTextRecordKeys,
		ensRegistrationStatuses,
		EnsRegistrationStatus,
	} from '$/constants/Ens.ts'

	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ensEthereumChainId } from '$/constants/Ens.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/ens/name/[ensName]', {
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


	// State
	import {
		decodeEnsContentHash,
		ensContentHashBrowseHref,
	} from '$/lib/ensContentHash.ts'

	import { resolveMediaUrlTransport } from '$/lib/media.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const

	const ens = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			],
			labelName: {},
			$resolvedActor: {},
			$subgraphResolvedActor: {},
			subdomainCount: {},
			textRecords: {},
			isMigrated: {},
			expiryDate: {},
			contentHash: {},
			...(open ? {
				labelhash: {},
				subgraphId: {},
				$resolverContract: {},
				$ownerActor: {},
				$subgraphOwnerActor: {},
				$registrantActor: {},
				$wrappedOwnerActor: {},
				$parent: {},
				$$subdomains: {},
				coinAddresses: {},
				resolverAbiJson: {},
				resolverTextKeys: {},
				resolverCoinTypes: {},
				ttl: {},
				createdAt: {},
				wrappedExpiryDate: {},
				wrappedFuses: {},
				registrationDate: {},
				registrationCost: {},
				registrationExpiryDate: {},
			} : {}),
		},
	)


	// (Derived)
	const ensNameIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Icon from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	href={href}
	{layout}
	bind:open
	summaryUsesHeading={true}
	title={entityId.name}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.name}
		</span>
	{/snippet}

	{#snippet Heading()}
		{@render Value()}
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={ens}
		>
			{#snippet children(loadedEns)}
				{@const aliasTrimmed = loadedEns.textRecords?.alias?.trim()}
				{@const legacyNameTrimmed = loadedEns.textRecords?.name?.trim()}
				{@const alias = (
					aliasTrimmed != null && aliasTrimmed !== '' ?
						aliasTrimmed
					: legacyNameTrimmed != null && legacyNameTrimmed !== '' ?
						legacyNameTrimmed
					:
						undefined
				)}
				{#if alias != null && alias !== entityId.name}
					<span data-text="muted">{alias}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ENS names map human-readable labels to resolver contracts on Ethereum mainnet; forward <code>addr</code> and <code>text</code> records live on the active resolver.
		</p>
		<p>
			Voltaire JSON-RPC rows reflect live registry reads; The Graph rows add registration, wrapper, and indexer metadata that may lag or differ from chain head.
		</p>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={ens}
		>
			{#snippet children(loadedEns)}
				{@const avatarRaw = loadedEns.textRecords?.avatar?.trim()}
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Resolved address</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading ENS name…"
						resource={ens}
					>
						{#snippet children(loadedEns)}
							{#if loadedEns.$resolvedActor !== undefined}
								<ActorView
									entityId={loadedEns.$resolvedActor[EntityMetaKey.Id]}
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
										ensName: entityId.name,
									})}
									layout={EntityLayout.Summary}
									open={false}
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
						{#snippet children(loadedEns)}
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
						{#snippet children(loadedEns)}
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
						{#snippet children(loadedEns)}
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
						{#snippet children(loadedEns)}
							{#if (
								ens.expiryDate !== undefined
								&& Number.isFinite(Number(ens.expiryDate))
							)}
								{ensRegistrationStatuses[
									(
										Date.now() < Number(ens.expiryDate) ?
											EnsRegistrationStatus.Active
										: Date.now() < Number(ens.expiryDate) + Number(ensGracePeriodSeconds) * 1000 ?
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
						{#snippet children(loadedEns)}
							{#if loadedEns.contentHash != null && loadedEns.contentHash !== ''}
								{@const decodedContentHash = decodeEnsContentHash(ens.contentHash)}
								{@const contentHashBrowseHref = ensContentHashBrowseHref(ens.contentHash)}
								<TruncatedValue
									value={loadedEns.contentHash}
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
						{#snippet children(loadedEns)}
							{#if loadedEns.isMigrated !== undefined}
								{loadedEns.isMigrated ? 'Yes' : 'No'}
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
							{#snippet children(loadedEns)}
								{#if loadedEns.$ownerActor !== undefined}
									<ActorNetworkView
										entityId={{
											$network: { chainId: ensEthereumChainId },
											$actor: loadedEns.$ownerActor[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Summary}
										open={false}
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
							{#snippet children(loadedEns)}
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

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.EnsName}
			{entityId}
		/>
		<div
			class="ens-view-carousel-groups"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${ensNameIdKey}:carousel-profile`}
				{...{ 'data-card': '' }}
				class="ens-view-collapsible-profile"
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Profile</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<ResourceBoundary resource={ens}>
						{#snippet children(loadedEns)}
							{@const headerMarkerRaw = loadedEns.textRecords?.header?.trim()}
							{@const headerMarkerUrl = (
								headerMarkerRaw != null && headerMarkerRaw !== '' ?
									resolveMediaUrlTransport(headerMarkerRaw)?.url
								:
									undefined
							)}
							{#if headerMarkerUrl != null}
								<a
									data-scroll-marker-label="Header"
									href={`#${ensNameIdKey}:profile-header`}
								>Header</a>
							{/if}
							<a
								data-scroll-marker-label="Profile records"
								href={`#${ensNameIdKey}:profile-records`}
							>Profile records</a>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<ResourceBoundary
						placeholderText="Loading profile…"
						resource={ens}
					>
						{#snippet children(loadedEns)}
							{@const headerRaw = loadedEns.textRecords?.header?.trim()}
							{@const headerUrl = (
								headerRaw != null && headerRaw !== '' ?
									resolveMediaUrlTransport(headerRaw)?.url
								:
									undefined
							)}
							{#if headerUrl != null}
								<section id={`${ensNameIdKey}:profile-header`}>
									<img
										alt=""
										class="ens-view-profile-header"
										src={headerUrl}
									/>
								</section>
							{/if}

							<section id={`${ensNameIdKey}:profile-records`}>
								<EnsNameTextRecordsView
									entityId={entityId}
									id={`${ensNameIdKey}:profile-records-list`}
									recordKeys={[...ensProfileTextRecordKeys]}
									title="ENSIP-18 profile records"
								/>
							</section>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameIdKey}:carousel-registration`}
				{...{ 'data-card': '' }}
				class="ens-view-collapsible-registration"
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Registration</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<ResourceBoundary resource={ens}>
						{#snippet children(loadedEns)}
							{#if (loadedEns.$$subdomains ?? []).length}
								<a
									data-scroll-marker-label="Subdomains"
									href={`#${ensNameIdKey}:registration-subdomains`}
								>Subdomains</a>
							{/if}

							{#if loadedEns.$parent !== undefined}
								<a
									data-scroll-marker-label="Parent"
									href={`#${ensNameIdKey}:registration-parent`}
								>Parent</a>
							{/if}

							<a
								data-scroll-marker-label="Registration metadata"
								href={`#${ensNameIdKey}:registration-metadata`}
							>Metadata</a>

							{#if loadedEns.$registrantActor !== undefined || loadedEns.$wrappedOwnerActor !== undefined}
								<a
									data-scroll-marker-label="Accounts"
									href={`#${ensNameIdKey}:registration-accounts`}
								>Accounts</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<ResourceBoundary
						placeholderText="Loading registration…"
						resource={ens}
					>
						{#snippet children(loadedEns)}
							{#if (loadedEns.$$subdomains ?? []).length}
								<section id={`${ensNameIdKey}:registration-subdomains`}>
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EnsName}
										getKey={(sub) => sub.name}
										getSortValue={(sub) => sub.name}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
											ensName: entityId.name,
										})}
										id={`${ensNameIdKey}:registration-subdomains-list`}
										items={loadedEns.$$subdomains.map((sub) => sub[EntityMetaKey.Id])}
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
								</section>
							{/if}

							{#if loadedEns.$parent !== undefined}
								<section id={`${ensNameIdKey}:registration-parent`}>
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EnsName}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
											ensName: entityId.name,
										})}
										id={`${ensNameIdKey}:registration-parent-list`}
										title="Parent name"
									>
										{#snippet body({ open: _bodyOpen })}
											<a
												data-link
												href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
													ensName: loadedEns.$parent[EntityMetaKey.Id].name,
												})}
											>{loadedEns.$parent[EntityMetaKey.Id].name}</a>
										{/snippet}
									</EntitiesList>
								</section>
							{/if}

							<section id={`${ensNameIdKey}:registration-accounts`}>
								<dl data-column-item="center">
									{#if loadedEns.$ownerActor !== undefined}
										<div>
											<dt>Registry owner (RPC)</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: loadedEns.$ownerActor[EntityMetaKey.Id],
													}}
													layout={EntityLayout.Summary}
													showTypeAnnotation={false}
												/>
											</dd>
										</div>
									{/if}

									{#if loadedEns.$subgraphOwnerActor !== undefined}
										<div>
											<dt>Subgraph owner</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: loadedEns.$subgraphOwnerActor[EntityMetaKey.Id],
													}}
													layout={EntityLayout.Summary}
													showTypeAnnotation={false}
												/>
											</dd>
										</div>
									{/if}

									{#if loadedEns.$registrantActor !== undefined}
										<div>
											<dt>Registrant (NFT)</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: loadedEns.$registrantActor[EntityMetaKey.Id],
													}}
													layout={EntityLayout.Summary}
													showTypeAnnotation={false}
												/>
											</dd>
										</div>
									{/if}

									{#if loadedEns.$wrappedOwnerActor !== undefined}
										<div>
											<dt>Name wrapper owner</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: loadedEns.$wrappedOwnerActor[EntityMetaKey.Id],
													}}
													layout={EntityLayout.Summary}
													showTypeAnnotation={false}
												/>
											</dd>
										</div>
									{/if}
								</dl>
							</section>

							<section id={`${ensNameIdKey}:registration-metadata`}>
								<dl data-column-item="center">
									{#if loadedEns.subgraphId != null && loadedEns.subgraphId !== ''}
										<div>
											<dt>Subgraph node id</dt>
											<dd>
												<TruncatedValue
													value={loadedEns.subgraphId}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if loadedEns.labelName != null && loadedEns.labelName !== '' && loadedEns.labelName !== entityId.name}
										<div>
											<dt>Label</dt>
											<dd>{loadedEns.labelName}</dd>
										</div>
									{/if}

									{#if loadedEns.labelhash != null && loadedEns.labelhash !== ''}
										<div>
											<dt>Labelhash</dt>
											<dd>
												<TruncatedValue
													value={loadedEns.labelhash}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if loadedEns.ttl !== undefined}
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
											<dt>Created (subgraph)</dt>
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

									{#if loadedEns.registrationCost !== undefined}
										<div>
											<dt>Registration cost (wei)</dt>
											<dd>
												<NumberValue value={loadedEns.registrationCost} />
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

									{#if loadedEns.wrappedFuses !== undefined}
										<div>
											<dt>Wrapper fuses</dt>
											<dd>{String(ens.wrappedFuses)}</dd>
										</div>
									{/if}
								</dl>
							</section>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameIdKey}:carousel-records`}
				{...{ 'data-card': '' }}
				class="ens-view-collapsible-records"
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Records</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<ResourceBoundary resource={ens}>
						{#snippet children(loadedEns)}
							<a
								data-scroll-marker-label="Text records"
								href={`#${ensNameIdKey}:records-text`}
							>Text records</a>
							{#if loadedEns.contentHash != null && loadedEns.contentHash !== ''}
								<a
									data-scroll-marker-label="Content hash"
									href={`#${ensNameIdKey}:records-content-hash`}
								>Content hash</a>
							{/if}

							{#if loadedEns.resolverAbiJson != null && loadedEns.resolverAbiJson !== ''}
								<a
									data-scroll-marker-label="Resolver ABI"
									href={`#${ensNameIdKey}:records-abi`}
								>Resolver ABI</a>
							{/if}

							{#if loadedEns.coinAddresses !== undefined && Object.keys(ens.coinAddresses).length > 0}
								<a
									data-scroll-marker-label="Coin addresses"
									href={`#${ensNameIdKey}:records-coins`}
								>Coin addresses</a>
							{/if}

							{#if (ens.resolverTextKeys ?? []).length || (ens.resolverCoinTypes ?? []).length}
								<a
									data-scroll-marker-label="Indexer"
									href={`#${ensNameIdKey}:records-indexer`}
								>Indexer</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<ResourceBoundary
						placeholderText="Loading records…"
						resource={ens}
					>
						{#snippet children(loadedEns)}
							{#if loadedEns.contentHash != null && loadedEns.contentHash !== ''}
								{@const decodedContentHash = decodeEnsContentHash(loadedEns.contentHash)}
								{@const contentHashBrowseHref = ensContentHashBrowseHref(loadedEns.contentHash)}
								<section id={`${ensNameIdKey}:records-content-hash`}>
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EnsName}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
											ensName: entityId.name,
										})}
										id={`${ensNameIdKey}:records-content-hash-list`}
										title="Content hash"
									>
										{#snippet body({ open: _bodyOpen })}
											<dl data-column-item="center">
												<div>
													<dt>Encoded (EIP-1577)</dt>
													<dd>
														<TruncatedValue
															value={loadedEns.contentHash}
															format={TruncatedValueFormat.Visual}
														/>
													</dd>
												</div>
												{#if decodedContentHash != null}
													<div>
														<dt>Decoded</dt>
														<dd>
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
														</dd>
													</div>
												{/if}
											</dl>
										{/snippet}
									</EntitiesList>
								</section>
							{/if}

							{#if loadedEns.resolverAbiJson != null && loadedEns.resolverAbiJson !== ''}
								<section id={`${ensNameIdKey}:records-abi`}>
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EnsName}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
											ensName: entityId.name,
										})}
										id={`${ensNameIdKey}:records-abi-list`}
										title="Resolver ABI"
									>
										{#snippet body({ open: _bodyOpen })}
											<dl data-column-item="center">
												<div>
													<dt>ABI (JSON)</dt>
													<dd>
														<TruncatedValue
															value={loadedEns.resolverAbiJson}
															format={TruncatedValueFormat.Visual}
														/>
													</dd>
												</div>
											</dl>
										{/snippet}
									</EntitiesList>
								</section>
							{/if}

							<section id={`${ensNameIdKey}:records-text`}>
								<EnsNameTextRecordsView
									entityId={entityId}
									excludeRecordKeys={[...ensProfileTextRecordKeys]}
									id={`${ensNameIdKey}:records-text-list`}
									title="General and social text records"
								/>
							</section>

							{#if loadedEns.coinAddresses !== undefined && Object.keys(ens.coinAddresses).length > 0}
								<section id={`${ensNameIdKey}:records-coins`}>
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EnsName}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
											ensName: entityId.name,
										})}
										id={`${ensNameIdKey}:records-coins-list`}
										title="Coin addresses"
									>
										{#snippet body({ open: _bodyOpen })}
											<dl data-column-item="center">
												{#each Object.entries(ens.coinAddresses) as [coinType, addr] (coinType)}
													<div>
														<dt>{(
															coinType in ensCoinTypeLabels ?
																ensCoinTypeLabels[coinType].label
															:
																`Coin type ${coinType}`
														)}</dt>
														<dd>
															<TruncatedValue
																value={addr}
																format={TruncatedValueFormat.Visual}
															/>
														</dd>
													</div>
												{/each}
											</dl>
										{/snippet}
									</EntitiesList>
								</section>
							{/if}

							{#if (ens.resolverTextKeys ?? []).length || (ens.resolverCoinTypes ?? []).length}
								<section id={`${ensNameIdKey}:records-indexer`}>
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EnsName}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
											ensName: entityId.name,
										})}
										id={`${ensNameIdKey}:records-indexer-list`}
										title="Subgraph resolver index"
									>
										{#snippet body({ open: _bodyOpen })}
											<dl data-column-item="center">
												{#if (ens.resolverTextKeys ?? []).length}
													<div>
														<dt>Text keys (indexer)</dt>
														<dd data-text="muted">{(ens.resolverTextKeys ?? []).join(', ')}</dd>
													</div>
												{/if}
												{#if (ens.resolverCoinTypes ?? []).length}
													<div>
														<dt>Coin types (indexer)</dt>
														<dd data-text="muted">
															{(ens.resolverCoinTypes ?? []).map((coinType) => (
																coinType in ensCoinTypeLabels ?
																	ensCoinTypeLabels[coinType].label
																:
																	`Coin type ${coinType}`
															)).join(', ')}
														</dd>
													</div>
												{/if}
											</dl>
										{/snippet}
									</EntitiesList>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${ensNameIdKey}:carousel-resolution`}
				{...{ 'data-card': '' }}
				class="ens-view-collapsible-resolution"
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Resolution</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<ResourceBoundary resource={ens}>
						{#snippet children(loadedEns)}
							{#if loadedEns.$resolvedActor !== undefined}
								<a
									data-scroll-marker-label="Addr record"
									href={`#${ensNameIdKey}:resolution-addr`}
								><code>addr</code></a>
							{/if}
							{#if loadedEns.$subgraphResolvedActor !== undefined}
								<a
									data-scroll-marker-label="Subgraph addr"
									href={`#${ensNameIdKey}:resolution-subgraph-addr`}
								>Subgraph <code>addr</code></a>
							{/if}
							{#if loadedEns.$resolverContract !== undefined}
								<a
									data-scroll-marker-label="Resolver"
									href={`#${ensNameIdKey}:resolution-resolver`}
								>Resolver</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<ResourceBoundary
						placeholderText="Loading resolution…"
						resource={ens}
					>
						{#snippet children(loadedEns)}
							{#if loadedEns.$resolvedActor !== undefined}
								<section id={`${ensNameIdKey}:resolution-addr`}>
									<ActorView
										entityId={loadedEns.$resolvedActor[EntityMetaKey.Id]}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
											ensName: entityId.name,
										})}
										title="Addr record (RPC)"
									/>
								</section>
							{/if}

							{#if loadedEns.$subgraphResolvedActor !== undefined}
								<section id={`${ensNameIdKey}:resolution-subgraph-addr`}>
									<ActorView
										entityId={loadedEns.$subgraphResolvedActor[EntityMetaKey.Id]}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
											ensName: entityId.name,
										})}
										title="Resolved address (subgraph)"
									/>
								</section>
							{/if}

							{#if loadedEns.$resolverContract !== undefined}
								<section id={`${ensNameIdKey}:resolution-resolver`}>
									<EvmContractView
										entityId={loadedEns.$resolverContract[EntityMetaKey.Id]}
										title="Resolver contract"
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>
		</div>
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
