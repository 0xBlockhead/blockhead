<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	// State
	let { entityFieldReference, title = 'Invoices', open = $bindable(true), id, href = '', ...EntitiesListProps }: WithRest<{ entityFieldReference: EntityFieldReference<typeof schema, EntityType.LightningInvoice>, title?: string, open?: boolean, id: string, href?: string }, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	import { proxy } from '$/routes/+layout.svelte'

	
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningInvoiceView from '$/views/LightningInvoiceView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningInvoice} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [Source.LightningLnd_Rest],
					limit: 32,
				})} placeholderText="Loading invoices…">
				{#snippet children(invoices)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LightningInvoice}
						id={`${id}-lightning-invoices`}
						href={href}
						getKey={(invoice) => stringify(invoice.entitySelector)}
						getSortValue={(invoice) => stringify(invoice.entitySelector)}
						open={true}
						items={invoices.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No invoices listed yet.</p>{/snippet}
						{#snippet Item({ item })}
							<LightningInvoiceView selector={item.entitySelector} layout={EntityLayout.Summary} />
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
