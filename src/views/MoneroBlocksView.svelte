<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Blocks',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MoneroBlock>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
</script>


<EntitiesList entityType={EntityType.MoneroBlock} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet TypeAnnotationTooltip()}
		<p>Monero blocks contain privacy-preserving transactions with ring signatures and stealth outputs.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
							Source.ThreeXpl_Rest,
						],
						limit: 16,
					},
				} }),
			)}
			{@const blocks = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.MoneroBlock>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.MoneroBlock}
				id={`${id}-items`}
				href={href}
				getKey={(block) => stringify(block[EntityMetaKey.Id])}
				getSortValue={(block) => -Number(block[EntityMetaKey.Id].height)}
				open={true}
				resource={blocks}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}<p data-text="muted">No recent blocks yet.</p>{/snippet}
				{#snippet Item(context)}
					<MoneroBlockView entityId={context!.item[EntityMetaKey.Id]} layout={EntityLayout.Summary} open={false} />
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
