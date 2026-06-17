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
	let { entityFieldReference, title = 'Payments', open = $bindable(true), id, href = '', ...EntitiesListProps }: WithRest<{ entityFieldReference: EntityFieldReference<typeof schema, EntityType.LightningPayment>, title?: string, open?: boolean, id: string, href?: string }, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	import { proxy } from '$/routes/+layout.svelte'

	
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningPaymentView from '$/views/LightningPaymentView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningPayment} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [Source.LightningLnd_Rest],
					limit: 32,
				})} placeholderText="Loading payments…">
				{#snippet children(payments)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LightningPayment}
						id={`${id}-lightning-payments`}
						href={href}
						getKey={(payment) => stringify(payment.entitySelector)}
						getSortValue={(payment) => stringify(payment.entitySelector)}
						open={true}
						items={payments.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No payments listed yet.</p>{/snippet}
						{#snippet Item({ item })}
							<LightningPaymentView selector={item.entitySelector} layout={EntityLayout.Summary} />
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
