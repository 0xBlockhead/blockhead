<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		ensTextRecordDisplayRank,
		getEnsCoinTypeLabel,
		getEnsTextRecordHref,
		getEnsTextRecordLabel,
	} from '$/constants/Ens.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EnsName>
			title?: string
			href: string
			open?: boolean
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const onchain = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			],
			labelName: {},
			textRecords: {},
			subdomainCount: {},
			...(open ? {
				labelhash: {},
				$resolvedActor: {},
				$resolverContract: {},
				$ownerActor: {},
				$parent: {},
				$$subdomains: {},
				contentHash: {},
				coinAddresses: {},
				resolverTextKeys: {},
				resolverCoinTypes: {},
				ttl: {},
				isMigrated: {},
				createdAt: {},
				expiryDate: {},
			} : {}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import Address from '$/views/Address.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
	import ContractView from '$/views/ContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	title={titleProp ?? (entityId.name === 'list' ? 'ENS' : entityId.name)}
>
	{#snippet Heading()}
		<span>
			{entityId.name === 'list' ? 'ENS' : entityId.name}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
{#if entityId.name === 'list'}
					<p>
						List view covers how the shared registry binds dotted names to deterministic ids and resolves profile data through delegated contracts.
					</p>
				{:else}
					<p>
						This name page tracks ownership lineage, resolver wiring, avatar links, routed addresses, and other text lookups registered for exactly this label.
					</p>
				{/if}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
		<dl>
			{#if entityId.name === 'list'}
				<div>
					<dt>Scope</dt>
					<dd>Ethereum execution-layer ENS registry + resolver graph</dd>
				</div>
			{:else}
				<ResourceBoundary
					placeholderText="Loading ENS name…"
					resource={onchain}
				>
					{#snippet children(onchain)}
						{@const textRecordEntries = (
							onchain.textRecords === undefined ?
								[]
							:	Object.entries(onchain.textRecords)
									.toSorted(([a], [b]) => (
										((
											ra,
											rb,
										) => (
											ra !== rb ?
												ra - rb
											:	a.localeCompare(b)
										))(
											a in ensTextRecordDisplayRank ?
												ensTextRecordDisplayRank[a]
											:	9999,
											b in ensTextRecordDisplayRank ?
												ensTextRecordDisplayRank[b]
											:	9999,
										)
									))
						)}
						{@const textRecordCount = textRecordEntries.length}
						{#if onchain.labelName != null && onchain.labelName !== '' && onchain.labelName !== entityId.name}
								<div>
									<dt>Label</dt>
									<dd>{onchain.labelName}</dd>
								</div>
						{/if}

						{#if textRecordCount > 0}
							<div>
								<dt>Text records</dt>
								<dd>{String(textRecordCount)}</dd>
							</div>
						{/if}

						{#if (onchain.subdomainCount ?? 0) > 0}
							<div>
								<dt>Subdomains</dt>
								<dd>{String(onchain.subdomainCount)}</dd>
							</div>
						{/if}

						{#if open}
							{#if onchain.labelhash != null}
								{#if onchain.labelhash !== ''}
									<div>
										<dt>Labelhash</dt>
										<dd>
											<TruncatedValue
												value={onchain.labelhash}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}
							{/if}

							{#if onchain.$parent !== undefined}
								<div>
									<dt>Parent</dt>
									<dd>
										<a
											data-link
											href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
												ensName: onchain.$parent[EntityMetaKey.Id].name,
											})}
										>{onchain.$parent[EntityMetaKey.Id].name}</a>
									</dd>
								</div>
							{/if}

							{#if (onchain.$$subdomains ?? []).length}
								<div>
									<dt>Subdomains</dt>
									<dd>
										<ul>
											{#each (onchain.$$subdomains ?? []) as sub (sub[EntityMetaKey.Id].name)}
												<li>
													<a
														data-link
														href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
															ensName: sub[EntityMetaKey.Id].name,
														})}
													>{sub[EntityMetaKey.Id].name}</a>
												</li>
											{/each}
										</ul>
									</dd>
								</div>
							{/if}

							{#if onchain.$resolvedActor !== undefined}
								<div>
									<dt>Forward resolution (<code>addr</code>)</dt>
									<dd>
										<ActorView
											entityId={onchain.$resolvedActor[EntityMetaKey.Id]}
											href={resolve('/~/(accounts)/accounts/account/[accountId]', {
												accountId: onchain.$resolvedActor[EntityMetaKey.Id].address,
											})}
											layout={EntityLayout.Id}
											open={false}
											showTypeAnnotation={false}
										/>
									</dd>
								</div>
							{/if}

							{#if onchain.$resolverContract !== undefined}
								<div>
									<dt>Active resolver (execution contract)</dt>
									<dd>
										<Address
											network={onchain.$resolverContract[EntityMetaKey.Id].$network}
											address={onchain.$resolverContract[EntityMetaKey.Id].address}
										/>
									</dd>
								</div>
							{/if}

							{#if onchain.$ownerActor !== undefined}
								<div>
									<dt>Owner</dt>
									<dd>
										<ActorView
											entityId={onchain.$ownerActor[EntityMetaKey.Id]}
											href={resolve('/~/(accounts)/accounts/account/[accountId]', {
												accountId: onchain.$ownerActor[EntityMetaKey.Id].address,
											})}
											layout={EntityLayout.Id}
											open={false}
											showTypeAnnotation={false}
										/>
									</dd>
								</div>
							{/if}

							{#if onchain.ttl !== undefined}
								<div>
									<dt>TTL</dt>
									<dd>{String(onchain.ttl)}</dd>
								</div>
							{/if}

							{#if onchain.isMigrated !== undefined}
								<div>
									<dt>Migrated</dt>
									<dd>{onchain.isMigrated ? 'Yes' : 'No'}</dd>
								</div>
							{/if}

							{#if onchain.createdAt !== undefined}
								{@const createdDetailMs = Number(onchain.createdAt)}
								{#if Number.isFinite(createdDetailMs)}
									<div>
										<dt>Created</dt>
										<dd>
											<Timestamp
												timestamp={createdDetailMs}
												format={TimestampFormat.Both}
											/>
										</dd>
									</div>
								{/if}
							{/if}

							{#if onchain.expiryDate !== undefined}
								{@const expiryMs = Number(onchain.expiryDate)}
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

							{#if (onchain.resolverTextKeys ?? []).length}
								<div>
									<dt>Resolver text keys (subgraph)</dt>
									<dd>
										<span data-text="muted">{(onchain.resolverTextKeys ?? []).join(', ')}</span>
									</dd>
								</div>
							{/if}

							{#if (onchain.resolverCoinTypes ?? []).length}
								<div>
									<dt>Resolver coin types (indexer)</dt>
									<dd>
										<span data-text="muted">{(onchain.resolverCoinTypes ?? []).join(', ')}</span>
									</dd>
								</div>
							{/if}

							{#if onchain.contentHash != null}
								{#if onchain.contentHash !== ''}
									<div>
										<dt>Content hash</dt>
										<dd>
											<TruncatedValue
												value={onchain.contentHash}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}
							{/if}

							{#if onchain.coinAddresses !== undefined}
								{#each Object.entries(onchain.coinAddresses) as [coinType, addr] (coinType)}
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
							{/if}

							{#if textRecordEntries.length}
								{#each textRecordEntries as [key, value] (key)}
									{@const trHref = getEnsTextRecordHref(key, value)}
									{@const trExternal = (
										trHref != null
										&& (
											trHref.startsWith('http://')
											|| trHref.startsWith('https://')
											|| trHref.startsWith('mailto:')
										)
									)}
									<div>
										<dt>{getEnsTextRecordLabel(key)}</dt>
										<dd>
											{#if trExternal}
												<button
													type="button"
													data-button="unstyled"
													data-link
													onclick={() => {
														if (trHref == null) return
														window.open(
															trHref,
															'_blank',
															'noopener,noreferrer',
														)
													}}
												>
													<TruncatedValue
														{value}
														format={TruncatedValueFormat.Visual}
													/>
												</button>
											{:else}
												<TruncatedValue
													{value}
													format={TruncatedValueFormat.Visual}
												/>
											{/if}
										</dd>
									</div>
								{/each}
							{/if}
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
		</div>
	{/snippet}

	{#snippet Details()}
		{#if entityId.name === 'list'}
			<EntityDetails
				entityType={EntityType.EnsName}
				{entityId}
			>
				<p>
					Enter an ENS name (for example <code>vitalik.eth</code>) to inspect registry rows, resolver contract bytecode,
					and forward <code>addr</code>/<code>text</code> payloads on the Ethereum execution layer.
				</p>
			</EntityDetails>
		{:else}
			<ResourceBoundary
				placeholderText="Loading ENS name…"
				resource={onchain}
			>
				{#snippet children(onchain)}
					{@const textRecordEntries = (
						onchain.textRecords === undefined ?
							[]
						:	Object.entries(onchain.textRecords)
								.toSorted(([a], [b]) => (
									((
										ra,
										rb,
									) => (
										ra !== rb ?
											ra - rb
										:	a.localeCompare(b)
									))(
										a in ensTextRecordDisplayRank ?
											ensTextRecordDisplayRank[a]
										:	9999,
										b in ensTextRecordDisplayRank ?
											ensTextRecordDisplayRank[b]
										:	9999,
									)
								))
					)}
					<EntityDetails
						entityType={EntityType.EnsName}
						{entityId}
					/>

					<div
						class="entity-view-detail-carousels"
						data-column="gap-3"
					>
						<CollapsibleTabs
							id={`${ensNameIdKey}:carousel-records`}
							{...{ 'data-card': '' }}
							scrollContainerProps={{
								'data-row': 'start align-start',
							}}
						>
							{#snippet Summary({ open: _isOpen })}
								<header data-row-item="flexible" data-row="wrap gap-4">
									<Heading>Resolver-linked text surface</Heading>
								</header>
							{/snippet}

							{#snippet Markers()}
								<a
									data-scroll-marker-label="Text records"
									href={`#${ensNameIdKey}:text-records`}
								>Text records</a>
								{#if onchain.$resolverContract !== undefined}
									<a
										data-scroll-marker-label="Resolver contract"
										href={`#${ensNameIdKey}:resolver-contract`}
									>Resolver bytecode</a>
								{/if}

								{#if onchain.$resolvedActor !== undefined}
									<a
										data-scroll-marker-label="Forward resolution"
										href={`#${ensNameIdKey}:resolves-to`}
									><code>addr</code> target</a>
								{/if}
							{/snippet}

							{#snippet children(_ctx)}
								<section
									id={`${ensNameIdKey}:text-records`}
								>
									<EnsNameTextRecordsView
										entityId={entityId}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
											ensName: entityId.name,
										})}
										open={false}
										recordKeys={textRecordEntries.map(([key]) => key)}
									/>
								</section>

								{#if onchain.$resolverContract !== undefined}
									<section
										id={`${ensNameIdKey}:resolver-contract`}
									>
										<ContractView
											entityId={onchain.$resolverContract[EntityMetaKey.Id]}
											href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
												ensName: entityId.name,
											})}
											open={false}
											title="Resolver contract"
										/>
									</section>
								{/if}

								{#if onchain.$resolvedActor !== undefined}
									<section
										id={`${ensNameIdKey}:resolves-to`}
									>
										<ActorView
											entityId={onchain.$resolvedActor[EntityMetaKey.Id]}
											href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
												ensName: entityId.name,
											})}
											open={false}
											title="Addr record"
										/>
									</section>
								{/if}
							{/snippet}
						</CollapsibleTabs>
					</div>
				{/snippet}
			</ResourceBoundary>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
