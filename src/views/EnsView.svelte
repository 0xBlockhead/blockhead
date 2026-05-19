<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EnsName>
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

	const ens = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				Source.TheGraph_Graphql,
			],
			labelName: {},
			labelhash: {},
			$resolvedActor: {},
			$resolverContract: {},
			$ownerActor: {},
			$parent: {},
			$$subdomains: {},
			subdomainCount: {},
			textRecords: {},
			contentHash: {},
			coinAddresses: {},
			resolverTextKeys: {},
			resolverCoinTypes: {},
			ttl: {},
			isMigrated: {},
			createdAt: {},
			expiryDate: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import ContractView from '$/views/ContractView.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	title={entityId.name}
>
	{#snippet Heading()}
		<span data-text="font-monospace">
			{entityId.name}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading ENS name…"
			resource={ens}
		>
			{#snippet children(snapshot)}
				<dl data-column-item="center">
					{#if snapshot.$resolvedActor !== undefined}
						<div>
							<dt>Resolved address</dt>
							<dd>
								<ActorView
									entityId={snapshot.$resolvedActor[EntityMetaKey.Id]}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: snapshot.$resolvedActor[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open}
						{#if snapshot.$ownerActor !== undefined}
							<div>
								<dt>Owner</dt>
								<dd>
									<ActorView
										entityId={snapshot.$ownerActor[EntityMetaKey.Id]}
										href={resolve('/~/(accounts)/accounts/account/[accountId]', {
											accountId: snapshot.$ownerActor[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Summary}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if snapshot.$resolverContract !== undefined}
							<div>
								<dt>Resolver</dt>
								<dd>
									<ContractView
										entityId={snapshot.$resolverContract[EntityMetaKey.Id]}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
											ensName: entityId.name,
										})}
										layout={EntityLayout.Summary}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if snapshot.$parent !== undefined}
							<div>
								<dt>Parent</dt>
								<dd>
									<a
										data-link
										href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
											ensName: snapshot.$parent[EntityMetaKey.Id].name,
										})}
									>{snapshot.$parent[EntityMetaKey.Id].name}</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if snapshot.contentHash != null && snapshot.contentHash !== ''}
							<div>
								<dt>Content hash</dt>
								<dd>
									<TruncatedValue
										value={snapshot.contentHash}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if snapshot.ttl !== undefined}
							<div>
								<dt>TTL</dt>
								<dd>{String(snapshot.ttl)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if snapshot.expiryDate !== undefined}
							{@const expiryMs = Number(snapshot.expiryDate)}
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

					{#if open}
						{#if snapshot.isMigrated !== undefined}
							<div>
								<dt>Migrated</dt>
								<dd>{snapshot.isMigrated ? 'Yes' : 'No'}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if (snapshot.subdomainCount ?? 0) > 0}
							<div>
								<dt>Subdomains</dt>
								<dd>{String(snapshot.subdomainCount)}</dd>
							</div>
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
						<Heading>ENS records</Heading>
					</header>
				{/snippet}

				{#snippet Markers()}
					<ResourceBoundary resource={ens}>
						{#snippet children(snapshot)}
							{#if (snapshot.$$subdomains ?? []).length}
								<a
									data-scroll-marker-label="Subdomains"
									href={`#${ensNameIdKey}:subdomains`}
								>Subdomains</a>
							{/if}
							<a
								data-scroll-marker-label="Text records"
								href={`#${ensNameIdKey}:text-records`}
							>Text records</a>
							{#if snapshot.coinAddresses !== undefined && Object.keys(snapshot.coinAddresses).length > 0}
								<a
									data-scroll-marker-label="Coin addresses"
									href={`#${ensNameIdKey}:coin-addresses`}
								>Coin addresses</a>
							{/if}

							{#if children}
								<a
									data-scroll-marker-label="Route"
									href={`#${ensNameIdKey}:page-content`}
								>Route</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(_ctx)}
					<ResourceBoundary
						placeholderText="Loading ENS records…"
						resource={ens}
					>
						{#snippet children(snapshot)}
							{#if (snapshot.$$subdomains ?? []).length}
								<section
									id={`${ensNameIdKey}:subdomains`}
								>
									<EntitiesList
										collapsible={false}
										entityType={EntityType.EnsName}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
											ensName: entityId.name,
										})}
										id={`${ensNameIdKey}:subdomains-list`}
										items={snapshot.$$subdomains.map(sub => sub[EntityMetaKey.Id])}
										getKey={(sub) => sub.name}
										getSortValue={(sub) => sub.name}
										title="Subdomains"
										open={false}
									>
										{#snippet Item({ item, isPlaceholder })}
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

							<section
								id={`${ensNameIdKey}:text-records`}
							>
								<EnsNameTextRecordsView
									entityId={entityId}
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
										ensName: entityId.name,
									})}
									open={false}
								/>
							</section>

							{#if snapshot.coinAddresses !== undefined && Object.keys(snapshot.coinAddresses).length > 0}
								<section
									id={`${ensNameIdKey}:coin-addresses`}
								>
									<dl data-column-item="center">
										{#each Object.entries(snapshot.coinAddresses) as [coinType, addr] (coinType)}
											<div>
												<dt>{coinType}</dt>
												<dd>
													<TruncatedValue
														value={addr}
														format={TruncatedValueFormat.Visual}
													/>
												</dd>
											</div>
										{/each}
									</dl>
								</section>
							{/if}

							{#if children}
								<section
									id={`${ensNameIdKey}:page-content`}
								>
									{@render children()}
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

