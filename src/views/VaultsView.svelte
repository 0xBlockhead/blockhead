<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(true),
		collapsible = true,
		title = 'Vaults',
		limit = 300,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Vault>
			id: string
			open?: boolean
			title?: string
			limit?: number
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import VaultView from '$/views/VaultView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.Vault}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Dexscreener “vault” rows are concentrated-liquidity trading pairs (token pair, volume, liquidity USD)—not ERC-4626 share vaults.
		</p>
		<p>
			The global catalog slice uses a fixed Dexscreener search probe (<code>ETH/USDT</code>), not an exhaustive on-chain registry.
		</p>
	{/snippet}

	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No Dexscreener pair rows in this slice yet.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Each row is a Dexscreener pair id on a supported network.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About vault rows"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Dexscreener_OpenApi,
						],
						limit,
					},
				},
			)}
			{@const vaults = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.Vault>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				data-entity-field-name={entityFieldReference.fieldName}
				data-entity-field-parent={stringify(entityFieldReference.entityId)}
				data-entity-field-type={entityFieldReference.entityType}
				entityType={EntityType.Vault}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
				open={true}
				resource={vaults}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Dexscreener pair rows in this slice yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<VaultView
						entityId={item.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
