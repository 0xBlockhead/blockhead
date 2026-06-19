<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type EthereumNetworkUpgradesResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.EvmNetwork,
		'$$upgrades'
	> | EntityProxyFieldResource<
		typeof schema,
		EntityType._Global,
		'$$networkUpgrades'
	>

	// State
	let {
		selection,
		title = 'Upgrades',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EthereumNetworkUpgradesResource
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EthereumNetworkUpgrade}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each network upgrade references a <strong>network execution upgrade</strong>; when both layers shipped together it also references a <strong>network consensus upgrade</strong>.
		</p>
		<p>
			Cards link to the paired execution and consensus fork views when present.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading upgrades…"
			>
				{#snippet children(upgrades)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EthereumNetworkUpgrade}
				id={`${id}-items`}
				href={href}
				getKey={(upgrade) => stringify(upgrade.entitySelector)}
				items={upgrades.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No upgrades yet.
					</p>
				{/snippet}

				{#snippet Item({ item: upgrade })}
					<NetworkUpgradeView
						selection={upgrade}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
