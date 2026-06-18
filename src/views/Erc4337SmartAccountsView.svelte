<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
		import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		selection,
		title = 'ERC-4337 smart accounts',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Erc4337SmartAccount}
	{id}
	{title}
	bind:open
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Smart accounts are ERC-4337 contract wallets Blockscout indexes separately from generic actors and verified contract catalogs.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
				<ResourceBoundary
					resource={selection({
						sources: [
							Source.Blockscout_Rest,
						],
						limit: 16,
					})}
				placeholderText="Loading smart accounts…"
			>
				{#snippet children(smartAccounts)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Erc4337SmartAccount}
				id={`${id}-items`}
				href={href}
				getKey={(smartAccount) => stringify(smartAccount.entitySelector)}
				getSortValue={(smartAccount) => smartAccount.entitySelector.address}
				placeholderText="Loading smart accounts…"
				items={smartAccounts.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No indexed smart accounts yet.</p>
				{/snippet}

				{#snippet Item({ item: smartAccount })}
					<Erc4337SmartAccountView
						selector={smartAccount.entitySelector}
						selection={smartAccount}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
