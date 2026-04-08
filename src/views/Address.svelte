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
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'

	import { entityFieldCollections } from '$/collections/$collections.ts'


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
	const resolvedActorId = $derived(
		actorId
		?? (
			network != null && address != null ?
				{ $network: network, address }
			:
				null
		)
	)
	const actorParentIdKey = $derived(
		resolvedActorId != null ?
			stringify(resolvedActorId)
		:
			null
	)


	// State
	const primaryNameQuery = useLiveQuery(
		(queryBuilder) => (
			actorParentIdKey != null ?
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
							Source.Voltaire,
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
							field[EntityMetaKey.Source],
							Source._User,
						)
					))
					.where(({ field }) => (
						eq(
							field[EntityMetaKey.Source],
							Source.Voltaire,
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
			actorParentIdKey != null ?
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
							Source.Voltaire,
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
							field[EntityMetaKey.Source],
							Source._User,
						)
					))
					.where(({ field }) => (
						eq(
							field[EntityMetaKey.Source],
							Source.Voltaire,
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
	const displayEnsName = $derived(
		ensNameProp
		?? (
			typeof primaryNameQuery.data?.[EntityMetaKey.Value]?.[EntityMetaKey.Id]?.name === 'string' ?
				primaryNameQuery.data[EntityMetaKey.Value][EntityMetaKey.Id].name
			:
				undefined
		)
	)

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
