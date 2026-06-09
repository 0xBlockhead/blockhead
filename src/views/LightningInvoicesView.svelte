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

	// State
	let { entityFieldReference, title = 'Invoices', open = $bindable(true), id, href = '', ...EntitiesListProps }: WithRest<{ entityFieldReference: EntityFieldReference<typeof schema, EntityType.LightningInvoice>, title?: string, open?: boolean, id: string, href?: string }, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningInvoiceView from '$/views/LightningInvoiceView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningInvoice} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext, entityFieldReference.entityType, entityFieldReference.entityId, ({ fields: { [entityFieldReference.fieldName]: { sources: [Source.LightningLnd_Rest], limit: 32 } } }))}
			{@const invoices = derive(parent, (parent): readonly Entity<typeof schema, EntityType.LightningInvoice>[] => (parent.fields[entityFieldReference.fieldName]?.values ?? []))}
			<EntitiesList collapsible={false} showSummary={false} entityType={EntityType.LightningInvoice} id={`${id}-lightning-invoices`} href={href} getKey={(invoice) => stringify(invoice[EntityMetaKey.Id])} getSortValue={(invoice) => stringify(invoice[EntityMetaKey.Id])} open={true} resource={invoices} {title} UnorderedListProps={{ orientation: ListOrientation.Column }}>
				{#snippet Empty()}<p data-text="muted">No invoices listed yet.</p>{/snippet}
				{#snippet Item(context)}
					<LightningInvoiceView entityId={context!.item[EntityMetaKey.Id]} layout={EntityLayout.Summary} open={false} />
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
