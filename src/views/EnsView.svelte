<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import {
		ensAvatarUrlFromTextRecords,
		ensDisplayAliasFromTextRecords,
		ensHeaderUrlFromTextRecords,
		ensProfileTextRecordKeys,
		ensRegistrationStatusFromExpiryMs,
		ensRegistrationStatusLabel,
		getEnsCoinTypeLabel,
		getEnsContentHashBrowseHref,
	} from '$/constants/Ens.ts'
	import { decodeEnsContentHash } from '$/lib/ensContentHash.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		HeadingTitle,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EnsName>
			href: string
			layout?: EntityLayout
			open?: boolean
			HeadingTitle?: Snippet
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()

	const ensNameIdKey = $derived(
		stringify(entityId),
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


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


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Icon from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import { ensEthereumChainId } from '$/constants/Ens.ts'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	{layout}
	bind:open
	summaryUsesHeading={true}
	title={entityId.name}
	{...entityViewRest}
>
	{#snippet Heading()}
		{#if HeadingTitle}
			{@render HeadingTitle()}
		{:else}
			<span data-text="font-monospace">
				{entityId.name}
			</span>
		{/if}
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			placeholderText=""
			resource={ens}
		>
			{#snippet children(ens)}
				{@const alias = ensDisplayAliasFromTextRecords(ens.textRecords)}
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
			placeholderText=""
			resource={ens}
		>
			{#snippet children(ens)}
				{@const avatarUrl = ensAvatarUrlFromTextRecords(ens.textRecords)}
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
		<ResourceBoundary
			placeholderText="Loading ENS name…"
			resource={ens}
		>
			{#snippet children(ens)}
				<dl data-column-item="center">
					{#if ens.$resolvedActor !== undefined}
						<div>
							<dt>Resolved address</dt>
							<dd>
								<ActorView
									entityId={ens.$resolvedActor[EntityMetaKey.Id]}
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
										ensName: entityId.name,
									})}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if ens.textRecords !== undefined}
						{@const textRecordCount = Object.keys(ens.textRecords).length}
						{#if textRecordCount > 0}
							<div>
								<dt>Text records</dt>
								<dd>{String(textRecordCount)}</dd>
							</div>
						{/if}
					{/if}

					{#if (ens.subdomainCount ?? 0) > 0}
						<div>
							<dt>Subdomains</dt>
							<dd>{String(ens.subdomainCount)}</dd>
						</div>
					{/if}

					{#if ens.coinAddresses !== undefined}
						{@const coinCount = Object.keys(ens.coinAddresses).length}
						{#if coinCount > 0}
							<div>
								<dt>Coin records</dt>
								<dd>{String(coinCount)}</dd>
							</div>
						{/if}
					{/if}

					{#if ens.expiryDate !== undefined}
						{@const expiryMs = Number(ens.expiryDate)}
						{#if Number.isFinite(expiryMs)}
							<div>
								<dt>Registration</dt>
								<dd>{ensRegistrationStatusLabel(ensRegistrationStatusFromExpiryMs(expiryMs))}</dd>
							</div>
						{/if}
					{/if}

					{#if ens.contentHash != null && ens.contentHash !== ''}
						{@const decodedContentHash = decodeEnsContentHash(ens.contentHash)}
						{@const contentHashBrowseHref = getEnsContentHashBrowseHref(ens.contentHash)}
						<div>
							<dt>Content hash</dt>
							<dd data-column="gap-1">
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
							</dd>
						</div>
					{/if}

					{#if ens.isMigrated !== undefined}
						<div>
							<dt>Migrated</dt>
							<dd>{ens.isMigrated ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open}
						{#if ens.$ownerActor !== undefined}
							<div>
								<dt>Owner</dt>
								<dd>
									<ActorNetworkView
										entityId={{
											$network: { chainId: ensEthereumChainId },
											$actor: ens.$ownerActor[EntityMetaKey.Id],
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
											{
												networkId: String(ensEthereumChainId),
												address: ens.$ownerActor[EntityMetaKey.Id].address,
											},
										)}
										layout={EntityLayout.Summary}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if ens.expiryDate !== undefined}
							{@const expiryMs = Number(ens.expiryDate)}
							{#if Number.isFinite(expiryMs)}
								<div>
									<dt>Expiry</dt>
									<dd>
										<Timestamp
											timestamp={expiryMs}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
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

				{#snippet Markers(_context)}
					<ResourceBoundary resource={ens}>
						{#snippet children(ens)}
							{#if ensHeaderUrlFromTextRecords(ens.textRecords) != null}
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

				{#snippet body(_ctx)}
					<ResourceBoundary
						placeholderText="Loading profile…"
						resource={ens}
					>
						{#snippet children(ens)}
							{@const headerUrl = ensHeaderUrlFromTextRecords(ens.textRecords)}
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
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
										ensName: entityId.name,
									})}
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

				{#snippet Markers(_context)}
					<ResourceBoundary resource={ens}>
						{#snippet children(ens)}
							{#if (ens.$$subdomains ?? []).length}
								<a
									data-scroll-marker-label="Subdomains"
									href={`#${ensNameIdKey}:registration-subdomains`}
								>Subdomains</a>
							{/if}

							{#if ens.$parent !== undefined}
								<a
									data-scroll-marker-label="Parent"
									href={`#${ensNameIdKey}:registration-parent`}
								>Parent</a>
							{/if}

							<a
								data-scroll-marker-label="Registration metadata"
								href={`#${ensNameIdKey}:registration-metadata`}
							>Metadata</a>

							{#if ens.$registrantActor !== undefined || ens.$wrappedOwnerActor !== undefined}
								<a
									data-scroll-marker-label="Accounts"
									href={`#${ensNameIdKey}:registration-accounts`}
								>Accounts</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body(_ctx)}
					<ResourceBoundary
						placeholderText="Loading registration…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if (ens.$$subdomains ?? []).length}
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
										items={ens.$$subdomains.map((sub) => sub[EntityMetaKey.Id])}
										title="Subdomains"
									>
										{#snippet Item({ item })}
											{#if item}
												<a
													data-link
													href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
														ensName: item.name,
													})}
												>{item.name}</a>
											{/if}
										{/snippet}
									</EntitiesList>
								</section>
							{/if}

							{#if ens.$parent !== undefined}
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
										{#snippet body()}
											<a
												data-link
												href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
													ensName: ens.$parent[EntityMetaKey.Id].name,
												})}
											>{ens.$parent[EntityMetaKey.Id].name}</a>
										{/snippet}
									</EntitiesList>
								</section>
							{/if}

							<section id={`${ensNameIdKey}:registration-accounts`}>
								<dl data-column-item="center">
									{#if ens.$ownerActor !== undefined}
										<div>
											<dt>Registry owner (RPC)</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: ens.$ownerActor[EntityMetaKey.Id],
													}}
													href={resolve(
														'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
														{
															networkId: String(ensEthereumChainId),
															address: ens.$ownerActor[EntityMetaKey.Id].address,
														},
													)}
													layout={EntityLayout.Summary}
													showTypeAnnotation={false}
												/>
											</dd>
										</div>
									{/if}

									{#if ens.$subgraphOwnerActor !== undefined}
										<div>
											<dt>Subgraph owner</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: ens.$subgraphOwnerActor[EntityMetaKey.Id],
													}}
													href={resolve(
														'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
														{
															networkId: String(ensEthereumChainId),
															address: ens.$subgraphOwnerActor[EntityMetaKey.Id].address,
														},
													)}
													layout={EntityLayout.Summary}
													showTypeAnnotation={false}
												/>
											</dd>
										</div>
									{/if}

									{#if ens.$registrantActor !== undefined}
										<div>
											<dt>Registrant (NFT)</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: ens.$registrantActor[EntityMetaKey.Id],
													}}
													href={resolve(
														'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
														{
															networkId: String(ensEthereumChainId),
															address: ens.$registrantActor[EntityMetaKey.Id].address,
														},
													)}
													layout={EntityLayout.Summary}
													showTypeAnnotation={false}
												/>
											</dd>
										</div>
									{/if}

									{#if ens.$wrappedOwnerActor !== undefined}
										<div>
											<dt>Name wrapper owner</dt>
											<dd>
												<ActorNetworkView
													entityId={{
														$network: { chainId: ensEthereumChainId },
														$actor: ens.$wrappedOwnerActor[EntityMetaKey.Id],
													}}
													href={resolve(
														'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
														{
															networkId: String(ensEthereumChainId),
															address: ens.$wrappedOwnerActor[EntityMetaKey.Id].address,
														},
													)}
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

									{#if ens.labelName != null && ens.labelName !== '' && ens.labelName !== entityId.name}
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

									{#if ens.createdAt !== undefined}
										{@const createdMs = Number(ens.createdAt)}
										{#if Number.isFinite(createdMs)}
											<div>
												<dt>Created (subgraph)</dt>
												<dd>
													<Timestamp
														timestamp={createdMs}
														format={TimestampFormat.Both}
													/>
												</dd>
											</div>
										{/if}
									{/if}

									{#if ens.registrationDate !== undefined}
										{@const registrationMs = Number(ens.registrationDate)}
										{#if Number.isFinite(registrationMs)}
											<div>
												<dt>Registered</dt>
												<dd>
													<Timestamp
														timestamp={registrationMs}
														format={TimestampFormat.Both}
													/>
												</dd>
											</div>
										{/if}
									{/if}

									{#if ens.registrationExpiryDate !== undefined}
										{@const registrationExpiryMs = Number(ens.registrationExpiryDate)}
										{#if Number.isFinite(registrationExpiryMs)}
											<div>
												<dt>Registration expiry</dt>
												<dd>
													<Timestamp
														timestamp={registrationExpiryMs}
														format={TimestampFormat.Both}
													/>
												</dd>
											</div>
										{/if}
									{/if}

									{#if ens.registrationCost !== undefined}
										<div>
											<dt>Registration cost (wei)</dt>
											<dd>
												<NumberValue value={ens.registrationCost} />
											</dd>
										</div>
									{/if}

									{#if ens.wrappedExpiryDate !== undefined}
										{@const wrappedExpiryMs = Number(ens.wrappedExpiryDate)}
										{#if Number.isFinite(wrappedExpiryMs)}
											<div>
												<dt>Wrapper expiry</dt>
												<dd>
													<Timestamp
														timestamp={wrappedExpiryMs}
														format={TimestampFormat.Both}
													/>
												</dd>
											</div>
										{/if}
									{/if}

									{#if ens.wrappedFuses !== undefined}
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

				{#snippet Markers(_context)}
					<ResourceBoundary resource={ens}>
						{#snippet children(ens)}
							<a
								data-scroll-marker-label="Text records"
								href={`#${ensNameIdKey}:records-text`}
							>Text records</a>
							{#if ens.contentHash != null && ens.contentHash !== ''}
								<a
									data-scroll-marker-label="Content hash"
									href={`#${ensNameIdKey}:records-content-hash`}
								>Content hash</a>
							{/if}

							{#if ens.resolverAbiJson != null && ens.resolverAbiJson !== ''}
								<a
									data-scroll-marker-label="Resolver ABI"
									href={`#${ensNameIdKey}:records-abi`}
								>Resolver ABI</a>
							{/if}

							{#if ens.coinAddresses !== undefined && Object.keys(ens.coinAddresses).length > 0}
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

				{#snippet body(_ctx)}
					<ResourceBoundary
						placeholderText="Loading records…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if ens.contentHash != null && ens.contentHash !== ''}
								{@const decodedContentHash = decodeEnsContentHash(ens.contentHash)}
								{@const contentHashBrowseHref = getEnsContentHashBrowseHref(ens.contentHash)}
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
										{#snippet body()}
											<dl data-column-item="center">
												<div>
													<dt>Encoded (EIP-1577)</dt>
													<dd>
														<TruncatedValue
															value={ens.contentHash}
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

							{#if ens.resolverAbiJson != null && ens.resolverAbiJson !== ''}
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
										{#snippet body()}
											<dl data-column-item="center">
												<div>
													<dt>ABI (JSON)</dt>
													<dd>
														<TruncatedValue
															value={ens.resolverAbiJson}
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
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
										ensName: entityId.name,
									})}
									id={`${ensNameIdKey}:records-text-list`}
									title="General and social text records"
								/>
							</section>

							{#if ens.coinAddresses !== undefined && Object.keys(ens.coinAddresses).length > 0}
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
										{#snippet body()}
											<dl data-column-item="center">
												{#each Object.entries(ens.coinAddresses) as [coinType, addr] (coinType)}
													<div>
														<dt>{getEnsCoinTypeLabel(coinType)}</dt>
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
										{#snippet body()}
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
															{(ens.resolverCoinTypes ?? []).map((coinType) => getEnsCoinTypeLabel(coinType)).join(', ')}
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

				{#snippet Markers(_context)}
					<ResourceBoundary resource={ens}>
						{#snippet children(ens)}
							{#if ens.$resolvedActor !== undefined}
								<a
									data-scroll-marker-label="Addr record"
									href={`#${ensNameIdKey}:resolution-addr`}
								><code>addr</code></a>
							{/if}
							{#if ens.$subgraphResolvedActor !== undefined}
								<a
									data-scroll-marker-label="Subgraph addr"
									href={`#${ensNameIdKey}:resolution-subgraph-addr`}
								>Subgraph <code>addr</code></a>
							{/if}
							{#if ens.$resolverContract !== undefined}
								<a
									data-scroll-marker-label="Resolver"
									href={`#${ensNameIdKey}:resolution-resolver`}
								>Resolver</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body(_ctx)}
					<ResourceBoundary
						placeholderText="Loading resolution…"
						resource={ens}
					>
						{#snippet children(ens)}
							{#if ens.$resolvedActor !== undefined}
								<section id={`${ensNameIdKey}:resolution-addr`}>
									<ActorView
										entityId={ens.$resolvedActor[EntityMetaKey.Id]}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
											ensName: entityId.name,
										})}
										title="Addr record (RPC)"
									/>
								</section>
							{/if}

							{#if ens.$subgraphResolvedActor !== undefined}
								<section id={`${ensNameIdKey}:resolution-subgraph-addr`}>
									<ActorView
										entityId={ens.$subgraphResolvedActor[EntityMetaKey.Id]}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
											ensName: entityId.name,
										})}
										title="Resolved address (subgraph)"
									/>
								</section>
							{/if}

							{#if ens.$resolverContract !== undefined}
								<section id={`${ensNameIdKey}:resolution-resolver`}>
									<EvmContractView
										entityId={ens.$resolverContract[EntityMetaKey.Id]}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
											ensName: entityId.name,
										})}
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

	.ens-view-carousel-groups :global(.carousel) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
