<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			| 'Summary'
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

	const ensNameRow = $derived(
		ensNameQuery.data?.[0]?.row,
	)

	const ensNameField = $derived(
		(() => {
			const bag = ensNameRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const textRecordsRaw = b.textRecords
			let textRecords: Record<string, string> | undefined
			if (
				textRecordsRaw != null
				&& typeof textRecordsRaw === 'object'
				&& !Array.isArray(textRecordsRaw)
			) {
				const raw = textRecordsRaw as Record<string, unknown>
				const o: Record<string, string> = {}
				for (const [k, v] of Object.entries(raw)) {
					if (typeof v === 'string') o[k] = v
				}
				if (Object.keys(o).length) textRecords = o
			}
			const evmRef = (key: string) => {
				const v = b[key]
				if (v == null || typeof v !== 'object' || Array.isArray(v)) return undefined
				const o = v as Record<string, unknown>
				const net = o.$network
				const addr = o.address
				if (
					net == null
					|| typeof net !== 'object'
					|| typeof addr !== 'string'
					|| !addr.startsWith('0x')
				) return undefined
				return {
					$network: net as EntityId<typeof schema, EntityType.Network>,
					address: addr as `0x${string}`,
				}
			}
			return {
				textRecords,
				resolvedActor: evmRef('$resolvedActor'),
				resolverContract: evmRef('$resolverContract'),
				ownerActor: evmRef('$ownerActor'),
			}
		})(),
	)

	const displayTitle = $derived(
		titleProp ??
		(entityId.name === 'list' ?
			'ENS'
		:	entityId.name),
	)

	const textRecordCount = $derived(
		ensNameField?.textRecords == null ?
			0
		:	Object.keys(ensNameField.textRecords).length,
	)

	const textRecordEntries = $derived(
		ensNameField?.textRecords == null ?
			[]
		:	Object.entries(ensNameField.textRecords)
				.sort(([a], [b]) => (
					a.localeCompare(b)
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			{#if entityId.name !== 'list'}
				<div>
					<dt>Name</dt>
					<dd>{entityId.name}</dd>
				</div>
			{/if}
			{#if textRecordCount > 0}
				<div>
					<dt>Text records</dt>
					<dd>{String(textRecordCount)}</dd>
				</div>
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
			<QueryBoundary
				query={ensNameQuery}
			>

				{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No ENS name row in collections yet (no resolver for this name).
						</p>
					{:else}
						<dl>
							{#if ensNameField?.resolvedActor != null}
								<div>
									<dt>Resolved actor</dt>
									<dd>
										<Address actorId={ensNameField.resolvedActor} />
									</dd>
								</div>
							{/if}
							{#if ensNameField?.resolverContract != null}
								<div>
									<dt>Resolver contract</dt>
									<dd>
										<Address
											network={ensNameField.resolverContract.$network}
											address={ensNameField.resolverContract.address}
										/>
									</dd>
								</div>
							{/if}
							{#if ensNameField?.ownerActor != null}
								<div>
									<dt>Owner</dt>
									<dd>
										<Address actorId={ensNameField.ownerActor} />
									</dd>
								</div>
							{/if}
						</dl>

						{#if textRecordEntries.length > 0}
							<dl>
								{#each textRecordEntries as [key, value] (key)}
									<div>
										<dt>{key}</dt>
										<dd>
											<TruncatedValue
												{value}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/each}
							</dl>
						{/if}
					{/if}
				{/snippet}
			</QueryBoundary>
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

			{#if ensNameField?.resolverContract != null}
				<EvmContractView
					entityId={{
						$network: ensNameField.resolverContract.$network,
						address: ensNameField.resolverContract.address,
					}}
					href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
						ensName: entityId.name,
					})}
					open={false}
					title="Resolver"
				/>
			{/if}

			{#if ensNameField?.resolvedActor != null}
				<ActorView
					entityId={ensNameField.resolvedActor}
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
