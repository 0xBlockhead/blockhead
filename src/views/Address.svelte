<script module lang="ts">
	// Types/constants
	export enum AddressFormat {
		Full = 'full',
		MiddleTruncated = 'middle-truncated',
	}
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
		actorId,
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
						name: field[EntityMetaKey.Value][EntityMetaKey.Id].name,
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
						name: field[EntityMetaKey.Value][EntityMetaKey.Id].name,
					}))
					.findOne()
		),
		[() => actorParentIdKey],
	)

	const actorAvatarQuery = useLiveQuery(
		(queryBuilder) => (
			actorParentIdKey !== undefined ?
				queryBuilder
					.from({
						field: entityFieldCollections[EntityType.Actor]['$icon'],
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
						avatar: field[EntityMetaKey.Value],
					}))
					.findOne()
			:
				queryBuilder
					.from({
						field: entityFieldCollections[EntityType.Actor]['$icon'],
					})
					.where(({ field }) => (
						eq(
							field[EntityMetaKey.ParentIdKey],
							noActorParentKey,
						)
					))
					.select(({ field }) => ({
						avatar: field[EntityMetaKey.Value],
					}))
					.findOne()
		),
		[() => actorParentIdKey],
	)


	// (Derived)
	const displayEnsName = $derived(
		ensNameProp ?? primaryNameQuery.data?.name,
	)

	const avatarUrl = $derived((
		actorAvatarQuery.data?.avatar?.[EntityMetaKey.Id].url
	))


	// Components
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


{#if addressResolved}
	<span data-row="inline">
		{#if showAvatar}
			{#if avatarUrl}
				<Icon
					shape={IconShape.Circle}
					src={avatarUrl}
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
