<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		title = 'Linked wallets',
		id,
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmAccount>
			id: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmAccount}
	{id}
	bind:open
	{collapsible}
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Linked wallets are execution-layer addresses associated with this facet (account, room, or profile).
		</p>
		<p>
			Empty lists usually mean nothing has been linked yet or the parent entity has not loaded its relations fully.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No linked wallets in this evmAccounts yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const actors = derive(
				parent,
				(parent) => {
					const evmAccounts: Entity<typeof schema, EntityType.EvmAccount>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						evmAccounts.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmAccount}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(row) => stringify(evmAccount.value[EntityMetaKey.Id])}
				getSortValue={(row) => evmAccount.value[EntityMetaKey.Id].address.toLowerCase()}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText="Loading linked wallets…"
				resource={actors}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No linked wallets in this evmAccounts yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const aid = item.value[EntityMetaKey.Id]}
					<EvmAccountView
						entityId={aid}
						href={resolve('/account/[address]', {
							address: aid.address,
						})}
						layout={EntityLayout.Summary}
						open={false}
						title="Account"
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
