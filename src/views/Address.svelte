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

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


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
		actorId?: EntityId<typeof schema, EntityType.Actor> | null
		network?: EntityId<typeof schema, EntityType.Network>
		address?: `0x${string}`
		ensName?: string
		format?: AddressFormat
		isLinked?: boolean
		showAvatar?: boolean
		isVertical?: boolean
	} = $props()


	// (Derived)
	const shownAddress = $derived(
		actorId?.address ?? address ?? undefined,
	)


	// State
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
</script>


{#if shownAddress}
	{#if showAvatar || ensNameProp === undefined}
		<ResourceBoundary
			resource={actor}
			placeholderText=""
		>
			{#snippet Pending()}
				<span data-row="inline wrap gap-1 align-center">
					{#if showAvatar}
						<Icon
							shape={IconShape.Circle}
							icon="◉"
							size="1.5em"
						/>
					{/if}

					<span data-text="font-monospace">
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
					</span>

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
						{#if avatarHref}
							<Icon
								shape={IconShape.Circle}
								src={avatarHref}
								size="1.5em"
								alt={ensNameProp ?? ''}
							/>
						{:else}
							<Icon
								shape={IconShape.Circle}
								icon="◉"
								size="1.5em"
								alt=""
							/>
						{/if}
					{/if}

					<span data-text="font-monospace">
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
					</span>

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
			<span data-text="font-monospace">
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
			</span>

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
{/if}
