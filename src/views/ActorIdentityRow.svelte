<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import { AddressFormat } from '$/views/Address.svelte'


	// Props
	let {
		entityId,
		ensName: ensNameProp,
		format = AddressFormat.MiddleTruncated,
		showAvatar = true,
	}: {
		entityId: EntityId<typeof schema, EntityType.Actor>
		ensName?: string
		format?: AddressFormat
		showAvatar?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const actor = useEntity(
		EntityType.Actor,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
			$icon: {},
			$primaryName: {},
		},
	)


	// Components
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<span data-row="inline">
	{#if showAvatar}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading…"
		>
			{#snippet children(ai)}
				{#if ai.$icon}
					<Icon
						shape={IconShape.Circle}
						src={ai.$icon[EntityMetaKey.Id].url}
						size="1.5em"
						alt={ensNameProp ?? ''}
					/>
				{:else}
					<Icon
						shape={IconShape.Circle}
						icon="◉"
						size="1.5em"
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/if}

	<span data-text="font-monospace">
		<TruncatedValue
			value={entityId.address}
			startLength={
				format === AddressFormat.Full ?
					entityId.address.length
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

	<ResourceBoundary
		resource={actor}
		placeholderText="Loading…"
	>
		{#snippet children(ap)}
			{@const primary = (
				ensNameProp
				?? ap.$primaryName?.[EntityMetaKey.Id].name
				?? ''
			)}
			{#if primary}
				<small>
					(<span data-text="font-monospace">{primary}</span>)
				</small>
			{/if}
		{/snippet}
	</ResourceBoundary>
</span>
