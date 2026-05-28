<script module lang="ts">


	// Types/constants
	export enum AddressFormat {
		Full = 'full',
		MiddleTruncated = 'middle-truncated',
	}
</script>


<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { blo } from 'blo'


	// State
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
		actorId?: EntityId<typeof schema, EntityType.Actor> | null
		network?: EntityId<typeof schema, EntityType.EvmNetwork>
		address?: `0x${string}`
		ensName?: string
		format?: AddressFormat
		isLinked?: boolean
		showAvatar?: boolean
		isVertical?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const actor = useEntity(
		EntityType.Actor,
		actorId
		?? (
			address !== undefined ?
				{ address }
			: { address: '0x0000000000000000000000000000000000000000' satisfies `0x${string}` }
		),
		{
			$: [Source.Voltaire_JsonRpc],
			$primaryName: {},
			$icon: {},
		},
	)


	const shownAddress = $derived(
		actorId?.address ?? address ?? undefined,
	)


	// Components
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


{#if (
	shownAddress
	&& (showAvatar || ensNameProp === undefined)
)}
	<ResourceBoundary
			resource={actor}
		>
			{#snippet Pending()}
				<span data-row="inline wrap gap-1 align-center">
					{#if showAvatar}
						<Icon
							shape={IconShape.Square}
							src={blo(shownAddress)}
							size="1.5em"
							alt=""
						/>
					{/if}

					<TruncatedValue
						value={shownAddress}
						startLength={
							format === AddressFormat.Full ?
								shownAddress.length
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
					{#if ensNameProp}
						<small>
							(<span data-text="font-monospace">{ensNameProp}</span>)
						</small>
					{/if}

					{#if network}
						<small data-text="muted">
							{' '}· <code>eip155:{network.chainId}</code>
						</small>
					{/if}
				</span>
			{/snippet}

			{#snippet children(actor)}
				<span data-row="inline wrap gap-1 align-center">
					{#if showAvatar}
						{@const avatarHref = actor.$icon?.[EntityMetaKey.Id].url}
						<Icon
							shape={avatarHref ? IconShape.Circle : IconShape.Square}
							src={avatarHref ?? blo(shownAddress)}
							size="1.5em"
							alt={ensNameProp ?? ''}
						/>
					{/if}

					<TruncatedValue
						value={shownAddress}
						startLength={
							format === AddressFormat.Full ?
								shownAddress.length
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
					{#if ensNameProp}
						<small>
							(<span data-text="font-monospace">{ensNameProp}</span>)
						</small>
					{:else}
						{@const forwardResolution = actor.$primaryName?.[EntityMetaKey.Id].name}
						{#if forwardResolution}
							<small>
								(<span data-text="font-monospace">{forwardResolution}</span>)
							</small>
						{/if}
					{/if}

					{#if network}
						<small data-text="muted">
							{' '}· <code>eip155:{network.chainId}</code>
						</small>
					{/if}
				</span>
			{/snippet}
		</ResourceBoundary>
	{:else}
		<span data-row="inline wrap gap-1 align-center">
			<TruncatedValue
				value={shownAddress}
				startLength={
					format === AddressFormat.Full ?
						shownAddress.length
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
			<small>
				(<span data-text="font-monospace">{ensNameProp}</span>)
			</small>

			{#if network}
				<small data-text="muted">
					{' '}· <code>eip155:{network.chainId}</code>
				</small>
			{/if}
		</span>
{/if}
