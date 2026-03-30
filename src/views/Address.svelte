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
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
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
		actorId?: { $network: EntityId<EntityType.Network>, address: `0x${string}` } | null
		network?: EntityId<EntityType.Network>
		address?: `0x${string}`
		ensName?: string
		format?: AddressFormat
		isLinked?: boolean
		showAvatar?: boolean
		isVertical?: boolean
	} = $props()

	const networkResolved = $derived(
		actorId?.$network ?? network
	)
	const addressResolved = $derived(
		actorId?.address ?? address ?? undefined
	)
	const ensName = $derived(ensNameProp)


	// Components
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


{#if addressResolved}
	<span data-row="inline">
		{#if showAvatar}
			<Icon
				shape={IconShape.Circle}
				icon="◉"
				size="1.5em"
			/>
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

		{#if ensName}
			<small>
				(<span data-text="font-monospace">{ensName}</span>)
			</small>
		{/if}

		{#if networkResolved}
			<small data-text="muted">
				{' '}· {networkResolved.chainId}
			</small>
		{/if}
	</span>
{/if}
