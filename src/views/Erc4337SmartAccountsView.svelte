<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityFieldReference,
		title = 'ERC-4337 smart accounts',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Erc4337SmartAccount>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const network = useEntity(entityCollectionsContext, EntityType.EvmNetwork,
				entityFieldReference.entityId,
				({ fields: { $$erc4337SmartAccounts: ({ sources: [
							Source.Blockscout_Rest,
						], limit: 16 }) } }),
			)}
			{@const smartAccounts = derive(
				network,
				(network): readonly Entity<typeof schema, EntityType.Erc4337SmartAccount>[] => (
					(network.fields.$$erc4337SmartAccounts?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.Erc4337SmartAccount}
				id={`${id}-items`}
				href={href}
				getKey={(smartAccount) => stringify(smartAccount[EntityMetaKey.Id])}
				getSortValue={(smartAccount) => smartAccount[EntityMetaKey.Id].address}
				placeholderText="Loading smart accounts…"
				resource={smartAccounts}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No indexed smart accounts yet.</p>
				{/snippet}

				{#snippet Item({ item: smartAccount })}
					<Erc4337SmartAccountView
						entityId={smartAccount[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
