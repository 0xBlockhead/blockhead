<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
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
			collapsible?: boolean
			title?: string
			limit?: number
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { proxy } from '$/routes/+layout.svelte'


	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import VaultView from '$/views/VaultView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.selector)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.Vault}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Vault vaults are reserved for actual vault-like asset containers, not DEX trading pairs.
		</p>
	{/snippet}

	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No vault vaults in this slice yet.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Liquidity pools are listed separately under pools.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About vault vaults"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector
				).field(entityFieldReference.fieldName, {
					limit,
				})} placeholderText="Loading vaults…">
				{#snippet children(vaults)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.Vault}
						id={`${id}-items`}
						{title}
						open={true}
						items={vaults.entities}
						getKey={(vault) => stringify(vault.entitySelector)}
						getSortValue={(vault) => vault.entitySelector.id}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No vault vaults in this slice yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<VaultView
							selector={item.entitySelector}
							layout={EntityLayout.Summary}

						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
