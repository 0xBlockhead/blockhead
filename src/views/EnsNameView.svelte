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

	const parseStringRecord = (raw: unknown) => {
		if (
			raw === undefined
			|| typeof raw !== 'object'
			|| Array.isArray(raw)
		) return undefined
		const o: Record<string, string> = {}
		for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
			if (typeof v === 'string') o[k] = v
		}
		return Object.keys(o).length ? o : undefined
	}

	const evmRef = (b: Record<string, unknown>, key: string) => {
		const v = b[key]
		if (v === undefined || typeof v !== 'object' || Array.isArray(v)) return undefined
		const o = v as Record<string, unknown>
		const net = o.$network
		const addr = o.address
		if (
			net === undefined
			|| typeof net !== 'object'
			|| typeof addr !== 'string'
			|| !addr.startsWith('0x')
		) return undefined
		return {
			$network: net as EntityId<typeof schema, EntityType.Network>,
			address: addr as `0x${string}`,
		}
	}

	const ensNameIdFromBag = (raw: unknown) => {
		if (raw === undefined || typeof raw !== 'object' || Array.isArray(raw)) return undefined
		const o = raw as Record<string, unknown>
		const id = o[EntityMetaKey.Id] ?? o
		if (id === undefined || typeof id !== 'object' || Array.isArray(id)) return undefined
		const name = (id as Record<string, unknown>).name
		return typeof name === 'string' && name !== '' ?
				{ name } as EntityId<typeof schema, EntityType.EnsName>
			:	undefined
	}

	const ensSubdomainsFromBag = (raw: unknown) => {
		if (!Array.isArray(raw)) return [] as EntityId<typeof schema, EntityType.EnsName>[]
		const out: EntityId<typeof schema, EntityType.EnsName>[] = []
		for (const item of raw) {
			const id = ensNameIdFromBag(item)
			if (id !== undefined) out.push(id)
		}
		return out
	}

	const stringListFromBag = (raw: unknown) => (
		Array.isArray(raw) ?
			raw.filter((x): x is string => typeof x === 'string')
		:	[]
	)

	const bigintFromBag = (raw: unknown) => (
		typeof raw === 'bigint' ?
			raw
		: typeof raw === 'string' || typeof raw === 'number' ?
			BigInt(raw)
		:	
			undefined
	)

	const ensMerged = $derived.by(() => {
		const voltaire = ensRows.find((r) => r[EntityMetaKey.Source] === Source.Voltaire_JsonRpc)
		const graph = ensRows.find((r) => r[EntityMetaKey.Source] === Source.TheGraph_Graphql)
		const v = voltaire?.[EntityMetaKey.Fields] as Record<string, unknown> | undefined
		const g = graph?.[EntityMetaKey.Fields] as Record<string, unknown> | undefined
		if (v === undefined && g === undefined) return null
		const vb = v ?? {}
		const gb = g ?? {}
		return {
			textRecords: parseStringRecord(vb.textRecords),
			coinAddresses: parseStringRecord(vb.coinAddresses),
			contentHash: (
				typeof vb.contentHash === 'string' && vb.contentHash !== '' ?
					vb.contentHash
				: typeof gb.contentHash === 'string' && gb.contentHash !== '' ?
					gb.contentHash
				:
					undefined
			),
			resolvedActor: evmRef(vb, '$resolvedActor'),
			resolverContract: evmRef(vb, '$resolverContract'),
			ownerActor: evmRef(vb, '$ownerActor'),
			labelName: typeof gb.labelName === 'string' ? gb.labelName : undefined,
			labelhash: typeof gb.labelhash === 'string' ? gb.labelhash : undefined,
			parent: ensNameIdFromBag(gb.$parent),
			subdomains: ensSubdomainsFromBag(gb.$$subdomains),
			subdomainCount: typeof gb.subdomainCount === 'number' ? gb.subdomainCount : undefined,
			resolverTextKeys: stringListFromBag(gb.resolverTextKeys),
			resolverCoinTypes: stringListFromBag(gb.resolverCoinTypes),
			ttl: bigintFromBag(gb.ttl),
			isMigrated: typeof gb.isMigrated === 'boolean' ? gb.isMigrated : undefined,
			createdAt: bigintFromBag(gb.createdAt),
			expiryDate: bigintFromBag(gb.expiryDate),
		}
	})

	const textRecordCount = $derived(
		ensMerged?.textRecords === undefined ?
			0
		:	Object.keys(ensMerged.textRecords).length,
	)

	const textRecordRank = (key: string) => (
		key in ensTextRecordDisplayRank ?
			ensTextRecordDisplayRank[key as keyof typeof ensTextRecordDisplayRank]
		:	9999
	)

	const textRecordEntries = $derived(
		ensMerged?.textRecords === undefined ?
			[]
		:	Object.entries(ensMerged.textRecords)
				.toSorted(([a], [b]) => (
					(() => {
						const ra = textRecordRank(a)
						const rb = textRecordRank(b)
						return ra !== rb ?
								ra - rb
							:	a.localeCompare(b)
					})()
				)),
	)

	const textRecordKeys = $derived(
		textRecordEntries.map(([key]) => key),
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
		<dl data-definition-list="vertical">
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
						{:else if ensMerged === undefined}
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
										{@const trExternal = trHref !== undefined && (trHref.startsWith('http://') || trHref.startsWith('https://') || trHref.startsWith('mailto:'))}
										<div>
											<dt>{getEnsTextRecordLabel(key)}</dt>
											<dd>
												{#if trExternal}
													<button
														type="button"
														data-button="unstyled"
														data-link
														onclick={() => {
															if (trHref === undefined) return
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
				recordKeys={textRecordKeys}
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
