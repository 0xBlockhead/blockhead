<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Account',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Actor>
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

	// Functions
	const evmHexAddress40 = (value: string): value is `0x${string}` => (
		/^0x[a-fA-F0-9]{40}$/.test(value)
	)


	// (Derived)
	const actorParentIdKey = $derived(
		stringify(entityId),
	)

	const ensOwnedQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					field: entityFieldCollections[EntityType.Actor]['$$ensNamesOwned'],
				})
				.where(({ field }) => (
					eq(
						field[EntityMetaKey.ParentIdKey],
						actorParentIdKey,
					)
				))
				.where(({ field }) => (
					eq(
						field[EntityMetaKey.Source],
						Source.TheGraph_Graphql,
					)
				))
				.select(({ field }) => ({
					value: field[EntityMetaKey.Value],
				}))
		),
		[() => actorParentIdKey],
	)

	const ensOwnedNames = $derived(
		(ensOwnedQuery.data ?? [])
			.map((row) => {
				const v = row.value as Record<string, unknown> | undefined
				if (v === undefined) return null
				const id = v[EntityMetaKey.Id] as Record<string, unknown> | undefined
				const name = id?.name
				return typeof name === 'string' && name !== '' ?
						name
					:	null
			})
			.filter((x): x is string => x !== undefined),
	)


	// Components
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'
	import Boundary from '$/components/Boundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.Actor}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Address</dt>
				<dd>
					<Address
						network={entityId.$network}
						address={entityId.address}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Actor}
			{entityId}
		>
			<Boundary>
				{#snippet Failed(err, _retry)}
					<p role="alert">
						{String(err)}
					</p>
				{/snippet}

				<p data-text="muted">
					ENS primary name and avatar resolve via Voltaire when available.
				</p>

				{#if entityId.interopAddress !== undefined && entityId.interopAddress !== ''}
					<dl>
						<div>
							<dt>Interop</dt>
							<dd>
								{#if evmHexAddress40(entityId.interopAddress)}
									<Address
										network={entityId.$network}
										address={entityId.interopAddress}
										showAvatar={false}
									/>
								{:else}
									<TruncatedValue
										value={entityId.interopAddress}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							</dd>
						</div>
					</dl>
				{/if}
			</Boundary>
		</EntityDetails>

		{#if ensOwnedNames.length > 0}
			<EntityDetails
				entityType={EntityType.Actor}
				{entityId}
			>
				<dl>
					<div>
						<dt>ENS names (The Graph)</dt>
						<dd>
							<ul>
								{#each ensOwnedNames as name (name)}
									<li>
										<a
											data-link
											href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
												ensName: name,
											})}
										>{name}</a>
									</li>
								{/each}
							</ul>
						</dd>
					</div>
				</dl>
			</EntityDetails>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
