<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import {
		ensTextRecordDisplayRank,
		getEnsCoinTypeLabel,
		getEnsTextRecordHref,
		getEnsTextRecordLabel,
	} from '$/constants/Ens.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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

	const ensNameQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EnsName] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						ensNameIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => ensNameIdKey],
	)

	const ensRows = $derived(
		ensNameQuery.data?.map((item) => item.row) ?? [],
	)

	const ensMerged = $derived.by(() => {
		const voltaire = ensRows.find((r) => r[EntityMetaKey.Source] === Source.Voltaire_JsonRpc)
		const graph = ensRows.find((r) => r[EntityMetaKey.Source] === Source.TheGraph_Graphql)
		const vRaw = voltaire?.[EntityMetaKey.Fields]
		const v = (typeof vRaw === 'object' && vRaw !== null && !Array.isArray(vRaw)) ? vRaw : undefined
		const gRaw = graph?.[EntityMetaKey.Fields]
		const g = (typeof gRaw === 'object' && gRaw !== null && !Array.isArray(gRaw)) ? gRaw : undefined
		if (v === undefined && g === undefined) return undefined
		return {
			textRecords: (
				v === undefined ?
					undefined
				: !(typeof v.textRecords === 'object' && v.textRecords !== null && !Array.isArray(v.textRecords)) ?
					undefined
				: ((rec) => (
					((o) => (
						Object.keys(o).length ?
							o
						:
							undefined
					))(
						Object.fromEntries(
							Object.entries(rec).filter((e): e is [string, string] => typeof e[1] === 'string'),
						),
					)
				))(v.textRecords)
			),
			coinAddresses: (
				v === undefined ?
					undefined
				: !(typeof v.coinAddresses === 'object' && v.coinAddresses !== null && !Array.isArray(v.coinAddresses)) ?
					undefined
				: ((rec) => (
					((o) => (
						Object.keys(o).length ?
							o
						:
							undefined
					))(
						Object.fromEntries(
							Object.entries(rec).filter((e): e is [string, string] => typeof e[1] === 'string'),
						),
					)
				))(v.coinAddresses)
			),
			contentHash: (
				v !== undefined && typeof v.contentHash === 'string' && v.contentHash !== '' ?
					v.contentHash
				: g !== undefined && typeof g.contentHash === 'string' && g.contentHash !== '' ?
					g.contentHash
				:
					undefined
			),
			resolvedActor: (
				v === undefined ?
					undefined
				: ((ref) => (
					!(typeof ref === 'object' && ref !== null && !Array.isArray(ref)) ?
						undefined
					: !('$network' in ref && 'address' in ref) ?
						undefined
					: ((net, addr) => (
						typeof net === 'object' && net !== null && !Array.isArray(net)
						&& 'chainId' in net
						&& typeof net.chainId === 'number'
						&& typeof addr === 'string'
						&& addr.startsWith('0x')
						&& addr.length > 2 ?
							({
								$network: { chainId: net.chainId },
								address: addr as `0x${string}`,
							} satisfies EntityId<typeof schema, EntityType.Actor>)
						:
							undefined
					))(ref['$network'], ref['address'])
				))(v['$resolvedActor'])
			),
			resolverContract: (
				v === undefined ?
					undefined
				: ((ref) => (
					!(typeof ref === 'object' && ref !== null && !Array.isArray(ref)) ?
						undefined
					: !('$network' in ref && 'address' in ref) ?
						undefined
					: ((net, addr) => (
						typeof net === 'object' && net !== null && !Array.isArray(net)
						&& 'chainId' in net
						&& typeof net.chainId === 'number'
						&& typeof addr === 'string'
						&& addr.startsWith('0x')
						&& addr.length > 2 ?
							({
								$network: { chainId: net.chainId },
								address: addr as `0x${string}`,
							} satisfies EntityId<typeof schema, EntityType.Actor>)
						:
							undefined
					))(ref['$network'], ref['address'])
				))(v['$resolverContract'])
			),
			ownerActor: (
				v === undefined ?
					undefined
				: ((ref) => (
					!(typeof ref === 'object' && ref !== null && !Array.isArray(ref)) ?
						undefined
					: !('$network' in ref && 'address' in ref) ?
						undefined
					: ((net, addr) => (
						typeof net === 'object' && net !== null && !Array.isArray(net)
						&& 'chainId' in net
						&& typeof net.chainId === 'number'
						&& typeof addr === 'string'
						&& addr.startsWith('0x')
						&& addr.length > 2 ?
							({
								$network: { chainId: net.chainId },
								address: addr as `0x${string}`,
							} satisfies EntityId<typeof schema, EntityType.Actor>)
						:
							undefined
					))(ref['$network'], ref['address'])
				))(v['$ownerActor'])
			),
			labelName: g !== undefined && typeof g.labelName === 'string' ? g.labelName : undefined,
			labelhash: g !== undefined && typeof g.labelhash === 'string' ? g.labelhash : undefined,
			parent: (
				g === undefined
				|| !(typeof g.$parent === 'object' && g.$parent !== null && !Array.isArray(g.$parent)) ?
					undefined
				: ((o) => (
					((idRaw) => (
						!(typeof idRaw === 'object' && idRaw !== null && !Array.isArray(idRaw)) ?
							undefined
						: 'name' in idRaw && typeof idRaw.name === 'string' && idRaw.name !== '' ?
							({ name: idRaw.name } satisfies EntityId<typeof schema, EntityType.EnsName>)
						:
							undefined
					))(o[EntityMetaKey.Id] ?? o)
				))(g.$parent)
			),
			subdomains: (
				g !== undefined && Array.isArray(g.$$subdomains) ?
					g.$$subdomains.flatMap((item) => (
						!(typeof item === 'object' && item !== null && !Array.isArray(item)) ?
							[]
						: ((idRaw) => (
							!(typeof idRaw === 'object' && idRaw !== null && !Array.isArray(idRaw)) ?
								[]
							: 'name' in idRaw && typeof idRaw.name === 'string' && idRaw.name !== '' ?
								[{ name: idRaw.name } satisfies EntityId<typeof schema, EntityType.EnsName>]
							:
								[]
						))(item[EntityMetaKey.Id] ?? item)
					))
				:	[]
			),
			subdomainCount: g !== undefined && typeof g.subdomainCount === 'number' ? g.subdomainCount : undefined,
			resolverTextKeys: (
				g !== undefined && Array.isArray(g.resolverTextKeys) ?
					g.resolverTextKeys.filter((x): x is string => typeof x === 'string')
				:	[]
			),
			resolverCoinTypes: (
				g !== undefined && Array.isArray(g.resolverCoinTypes) ?
					g.resolverCoinTypes.filter((x): x is string => typeof x === 'string')
				:	[]
			),
			ttl: (
				g === undefined ?
					undefined
				: typeof g.ttl === 'bigint' ?
					g.ttl
				: typeof g.ttl === 'string' || typeof g.ttl === 'number' ?
					BigInt(g.ttl)
				:
					undefined
			),
			isMigrated: g !== undefined && typeof g.isMigrated === 'boolean' ? g.isMigrated : undefined,
			createdAt: (
				g === undefined ?
					undefined
				: typeof g.createdAt === 'bigint' ?
					g.createdAt
				: typeof g.createdAt === 'string' || typeof g.createdAt === 'number' ?
					BigInt(g.createdAt)
				:
					undefined
			),
			expiryDate: (
				g === undefined ?
					undefined
				: typeof g.expiryDate === 'bigint' ?
					g.expiryDate
				: typeof g.expiryDate === 'string' || typeof g.expiryDate === 'number' ?
					BigInt(g.expiryDate)
				:
					undefined
			),
		}
	})

	const textRecordCount = $derived(
		ensMerged?.textRecords === undefined ?
			0
		:	Object.keys(ensMerged.textRecords).length,
	)

	const textRecordEntries = $derived(
		ensMerged?.textRecords === undefined ?
			[]
		:	Object.entries(ensMerged.textRecords)
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
				)),
	)


	// Components
	import Address from '$/views/Address.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import EnsNameTextRecordsView from '$/views/EnsNameTextRecordsView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={titleProp ?? (entityId.name === 'list' ? 'ENS' : entityId.name)}
>
	{#snippet Content()}
		<dl>
			{#if entityId.name === 'list'}
				<div>
					<dt>Scope</dt>
					<dd>Ethereum mainnet ENS</dd>
				</div>
			{/if}
			{#if ensMerged?.labelName !== undefined && ensMerged.labelName !== '' && entityId.name !== 'list'}
				<div>
					<dt>Label</dt>
					<dd>{ensMerged.labelName}</dd>
				</div>
			{/if}
			{#if textRecordCount > 0}
				<div>
					<dt>Text records</dt>
					<dd>{String(textRecordCount)}</dd>
				</div>
			{/if}
			{#if (ensMerged?.subdomainCount ?? 0) > 0}
				<div>
					<dt>Subdomains</dt>
					<dd>{String(ensMerged?.subdomainCount)}</dd>
				</div>
			{/if}
			{#if ensMerged?.createdAt !== undefined && entityId.name !== 'list'}
				{@const createdMs = Number(ensMerged.createdAt)}
				{#if Number.isFinite(createdMs)}
					<div>
						<dt>Timestamp</dt>
						<dd>
							<Timestamp
								timestamp={createdMs}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.EnsName}
			{entityId}
		>
			{#if entityId.name === 'list'}
				<p>
					Use an ENS full name (for example <code>vitalik.eth</code>) in the URL to load on-chain and
					indexed ENS details.
				</p>
				<p data-text="muted">
					This hub entry does not correspond to a single on-chain name.
				</p>
			{:else}
				<QueryBoundary
					query={ensNameQuery}
				>

					{#snippet children(rows)}
						{#if rows === undefined || rows.length === 0}
							<p data-text="muted">
								No ENS rows in the local collection for this name yet. Data loads on demand; try again
								after the request completes or confirm the label exists.
							</p>
						{:else if ensMerged == null}
							<p data-text="muted">
								ENS sources returned no fields for this name.
							</p>
						{:else}
							<dl>
								{#if ensMerged.labelName !== undefined && ensMerged.labelName !== ''}
									<div>
										<dt>Label</dt>
										<dd>{ensMerged.labelName}</dd>
									</div>
								{/if}
								{#if ensMerged.labelhash !== undefined && ensMerged.labelhash !== ''}
									<div>
										<dt>Labelhash</dt>
										<dd>
											<TruncatedValue
												value={ensMerged.labelhash}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}
								{#if ensMerged.parent !== undefined}
									<div>
										<dt>Parent</dt>
										<dd>
											<a
												data-link
												href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
													ensName: ensMerged.parent.name,
												})}
											>{ensMerged.parent.name}</a>
										</dd>
									</div>
								{/if}
								{#if ensMerged.subdomains.length > 0}
									<div>
										<dt>Subdomains</dt>
										<dd>
											<ul>
												{#each ensMerged.subdomains as sub (sub.name)}
													<li>
														<a
															data-link
															href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
																ensName: sub.name,
															})}
														>{sub.name}</a>
													</li>
												{/each}
											</ul>
										</dd>
									</div>
								{/if}
								{#if ensMerged.resolvedActor !== undefined}
									<div>
										<dt>Resolved actor</dt>
										<dd>
											<Address actorId={ensMerged.resolvedActor} />
										</dd>
									</div>
								{/if}
								{#if ensMerged.resolverContract !== undefined}
									<div>
										<dt>Resolver contract</dt>
										<dd>
											<Address
												network={ensMerged.resolverContract.$network}
												address={ensMerged.resolverContract.address}
											/>
										</dd>
									</div>
								{/if}
								{#if ensMerged.ownerActor !== undefined}
									<div>
										<dt>Owner</dt>
										<dd>
											<Address actorId={ensMerged.ownerActor} />
										</dd>
									</div>
								{/if}
								{#if ensMerged.ttl !== undefined}
									<div>
										<dt>TTL</dt>
										<dd>{String(ensMerged.ttl)}</dd>
									</div>
								{/if}
								{#if ensMerged.isMigrated !== undefined}
									<div>
										<dt>Migrated</dt>
										<dd>{ensMerged.isMigrated ? 'Yes' : 'No'}</dd>
									</div>
								{/if}
								{#if ensMerged.createdAt !== undefined}
									{@const createdDetailMs = Number(ensMerged.createdAt)}
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
								{#if ensMerged.expiryDate !== undefined}
									{@const expiryMs = Number(ensMerged.expiryDate)}
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
							</dl>

							{#if ensMerged.resolverTextKeys.length > 0 || ensMerged.resolverCoinTypes.length > 0}
								<dl>
									{#if ensMerged.resolverTextKeys.length > 0}
										<div>
											<dt>Resolver text keys (indexer)</dt>
											<dd>
												<span data-text="muted">{ensMerged.resolverTextKeys.join(', ')}</span>
											</dd>
										</div>
									{/if}
									{#if ensMerged.resolverCoinTypes.length > 0}
										<div>
											<dt>Resolver coin types (indexer)</dt>
											<dd>
												<span data-text="muted">{ensMerged.resolverCoinTypes.join(', ')}</span>
											</dd>
										</div>
									{/if}
								</dl>
							{/if}

							{#if ensMerged.contentHash !== undefined && ensMerged.contentHash !== ''}
								<dl>
									<div>
										<dt>Content hash</dt>
										<dd>
											<TruncatedValue
												value={ensMerged.contentHash}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								</dl>
							{/if}

							{#if ensMerged.coinAddresses !== undefined}
								<dl>
									{#each Object.entries(ensMerged.coinAddresses) as [coinType, addr] (coinType)}
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
							{/if}

							{#if textRecordEntries.length > 0}
								<dl>
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
								</dl>
							{:else if ensRows.some((r) => r[EntityMetaKey.Source] === Source.Voltaire_JsonRpc)}
								<p data-text="muted">
									No text records returned from the live resolver for this name.
								</p>
							{/if}
						{/if}
					{/snippet}
				</QueryBoundary>
			{/if}
		</EntityDetails>

		{#if entityId.name !== 'list'}
			<EnsNameTextRecordsView
				entityId={entityId}
				href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/records', {
					ensName: entityId.name,
				})}
				open={false}
				recordKeys={textRecordEntries.map(([key]) => key)}
			/>

			{#if ensMerged?.resolverContract !== undefined}
				<EvmContractView
					entityId={{
						$network: ensMerged.resolverContract.$network,
						address: ensMerged.resolverContract.address,
					}}
					href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
						ensName: entityId.name,
					})}
					open={false}
					title="Resolver"
				/>
			{/if}

			{#if ensMerged?.resolvedActor !== undefined}
				<ActorView
					entityId={ensMerged.resolvedActor}
					href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
						ensName: entityId.name,
					})}
					open={false}
					title="Resolves to"
				/>
			{/if}
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
