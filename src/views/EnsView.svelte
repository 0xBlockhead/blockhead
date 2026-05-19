<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { getEnsCoinTypeLabel } from '$/constants/Ens.ts'
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
		Title,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EnsName>
			href: string
			layout?: EntityLayout
			open?: boolean
			Title?: Snippet
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
			subdomainCount: {},
			textRecords: {},
			...(open ? {
				labelhash: {},
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
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
	{layout}
	bind:open
	{...entityViewRest}
	title={entityId.name}
>
	{#snippet Heading()}
		{#if Title}
			{@render Title()}
		{:else}
			<span data-text="font-monospace">
				{entityId.name}
			</span>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ENS names map human-readable labels to resolver contracts on Ethereum mainnet; forward <code>addr</code> and <code>text</code> records live on the active resolver.
		</p>
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

					{#if open}
						{#if ens.$ownerActor !== undefined}
							<div>
								<dt>Owner</dt>
								<dd>
									<ActorView
										entityId={ens.$ownerActor[EntityMetaKey.Id]}
										href={resolve('/~/(accounts)/accounts/account/[accountId]', {
											accountId: ens.$ownerActor[EntityMetaKey.Id].address,
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

				{#snippet Markers()}
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
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(_ctx)}
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
										open={false}
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
										open={false}
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

							<section id={`${ensNameIdKey}:registration-metadata`}>
								<dl data-column-item="center">
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

									{#if ens.isMigrated !== undefined}
										<div>
											<dt>Migrated</dt>
											<dd>{ens.isMigrated ? 'Yes' : 'No'}</dd>
										</div>
									{/if}

									{#if ens.createdAt !== undefined}
										{@const createdMs = Number(ens.createdAt)}
										{#if Number.isFinite(createdMs)}
											<div>
												<dt>Created</dt>
												<dd>
													<Timestamp
														timestamp={createdMs}
														format={TimestampFormat.Both}
													/>
												</dd>
											</div>
										{/if}
									{/if}

									{#if ens.contentHash != null && ens.contentHash !== ''}
										<div>
											<dt>Content hash</dt>
											<dd>
												<TruncatedValue
													value={ens.contentHash}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
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

				{#snippet Markers()}
					<ResourceBoundary resource={ens}>
						{#snippet children(ens)}
							<a
								data-scroll-marker-label="Text records"
								href={`#${ensNameIdKey}:records-text`}
							>Text records</a>
							{#if ens.coinAddresses !== undefined && Object.keys(ens.coinAddresses).length > 0}
								<a
									data-scroll-marker-label="Coin addresses"
									href={`#${ensNameIdKey}:records-coins`}
								>Coin addresses</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(_ctx)}
					<ResourceBoundary
						placeholderText="Loading records…"
						resource={ens}
					>
						{#snippet children(ens)}
							<section id={`${ensNameIdKey}:records-text`}>
								<EnsNameTextRecordsView
									entityId={entityId}
									href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
										ensName: entityId.name,
									})}
									id={`${ensNameIdKey}:records-text-list`}
									open={false}
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
										open={false}
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

				{#snippet Markers()}
					<ResourceBoundary resource={ens}>
						{#snippet children(ens)}
							{#if ens.$resolvedActor !== undefined}
								<a
									data-scroll-marker-label="Addr record"
									href={`#${ensNameIdKey}:resolution-addr`}
								><code>addr</code></a>
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

				{#snippet children(_ctx)}
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
										open={false}
										title="Addr record"
									/>
								</section>
							{/if}

							{#if ens.$resolverContract !== undefined}
								<section id={`${ensNameIdKey}:resolution-resolver`}>
									<ContractView
										entityId={ens.$resolverContract[EntityMetaKey.Id]}
										href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
											ensName: entityId.name,
										})}
										open={false}
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
