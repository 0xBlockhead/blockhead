<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type LightningInvoicesResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.LightningNetwork,
		'$$invoices'
	>

	// State
	let { resource, title = 'Invoices', open = $bindable(true), id, href = '', ...EntitiesListProps }: WithRest<{ selection: LightningInvoicesResource, title?: string, open?: boolean, id: string, href?: string }, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningInvoiceView from '$/views/LightningInvoiceView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningInvoice} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			<ResourceBoundary {resource} placeholderText="Loading invoices…">
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
