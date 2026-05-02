<script module lang="ts">
	// Types/constants
	export const AddressFormat = {
		Full: 'full',
		MiddleTruncated: 'middle-truncated',
	} as const

	export type AddressFormat = (typeof AddressFormat)[keyof typeof AddressFormat]
</script>


<script lang="ts">
	// Types/constants
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		actorId: actorId,
		network,
		address,
		ensName: ensNameProp,
		format = AddressFormat.MiddleTruncated,
		isLinked: _isLinked = true,
		showAvatar = true,
		isVertical: _isVertical = false,
	}: {
		actorId?: { $network: EntityId<typeof schema, EntityType.Network>, address: `0x${string}` } | null
		network?: EntityId<typeof schema, EntityType.Network>
		address?: `0x${string}`
		ensName?: string
		format?: AddressFormat
		isLinked?: boolean
		showAvatar?: boolean
		isVertical?: boolean
	} = $props()


	// (Derived)
	const networkResolved = $derived(
		actorId?.$network ?? network
	)
	const addressResolved = $derived(
		actorId?.address ?? address ?? undefined
	)
	const actorParentIdKey = $derived(
		(
			(
				(r) => (
					r !== undefined ?
						stringify(r)
					: null
				)
			)(
				actorId
				?? (
					network !== undefined && address !== undefined ?
						{ $network: network, address }
					: null
				),
			)
		),
	)


	// State
	const noActorParentKey = '\0actor:primary-name:none'

	const primaryNameQuery = useLiveQuery(
		(queryBuilder) => (
			actorParentIdKey !== undefined ?
				queryBuilder
					.from({
						field: entityFieldCollections[EntityType.Actor]['$primaryName'],
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
							Source.Voltaire_JsonRpc,
						)
					))
					.select(({ field }) => ({
						[EntityMetaKey.Value]: field[EntityMetaKey.Value],
					}))
					.findOne()
			:
				queryBuilder
					.from({
						field: entityFieldCollections[EntityType.Actor]['$primaryName'],
					})
					.where(({ field }) => (
						eq(
							field[EntityMetaKey.ParentIdKey],
							noActorParentKey,
						)
					))
					.select(({ field }) => ({
						[EntityMetaKey.Value]: field[EntityMetaKey.Value],
					}))
					.findOne()
		),
		[() => actorParentIdKey],
	)

	const avatarUrlQuery = useLiveQuery(
		(queryBuilder) => (
			actorParentIdKey !== undefined ?
				queryBuilder
					.from({
						field: entityFieldCollections[EntityType.Actor]['avatarUrl'],
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
							Source.Voltaire_JsonRpc,
						)
					))
					.select(({ field }) => ({
						[EntityMetaKey.Value]: field[EntityMetaKey.Value],
					}))
					.findOne()
			:
				queryBuilder
					.from({
						field: entityFieldCollections[EntityType.Actor]['avatarUrl'],
					})
					.where(({ field }) => (
						eq(
							field[EntityMetaKey.ParentIdKey],
							noActorParentKey,
						)
					))
					.select(({ field }) => ({
						[EntityMetaKey.Value]: field[EntityMetaKey.Value],
					}))
					.findOne()
		),
		[() => actorParentIdKey],
	)


	// (Derived)
	const displayEnsName = $derived.by(() => {
		if (ensNameProp !== undefined) return ensNameProp
		const wrapped = primaryNameQuery.data?.[EntityMetaKey.Value]
		if (wrapped === undefined || typeof wrapped !== 'object') return undefined
		const inner = (wrapped as Record<string, unknown>)[EntityMetaKey.Id]
		if (inner === undefined || typeof inner !== 'object') return undefined
		const name = (inner as { name?: unknown }).name
		return typeof name === 'string' ? name : undefined
	})

	const avatarUrlResolved = $derived(
		typeof avatarUrlQuery.data?.[EntityMetaKey.Value] === 'string' ?
			avatarUrlQuery.data[EntityMetaKey.Value]
		:
			undefined
	)


	// Components
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


{#if addressResolved}
	<span data-row="inline">
		{#if showAvatar}
			{#if avatarUrlResolved}
				<Icon
					shape={IconShape.Circle}
					src={avatarUrlResolved}
					size="1.5em"
					alt={displayEnsName ?? ''}
				/>
			{:else}
				<Icon
					shape={IconShape.Circle}
					icon="◉"
					size="1.5em"
				/>
			{/if}
		{/if}

		<span data-text="font-monospace">
			<TruncatedValue
				value={addressResolved}
				startLength={
					format === AddressFormat.Full ?
						addressResolved.length
					:
						6
				}
				endLength={
					format === AddressFormat.Full ?
						0
					:
						4
				}
				format={TruncatedValueFormat.Visual}
			/>
		</span>

		{#if displayEnsName}
			<small>
				(<span data-text="font-monospace">{displayEnsName}</span>)
			</small>
		{/if}

		{#if networkResolved}
			<small data-text="muted">
				 · {networkResolved.chainId}
			</small>
		{/if}
	</span>
{/if}
