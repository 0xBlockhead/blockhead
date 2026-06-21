<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type LightningPaymentsResource = EntityProxyEntitiesResource<
		typeof schema,
		EntityType.LightningPayment
	>

	// State
	let { selection, title = 'Payments', open = $bindable(true), id, href = '', ...EntitiesListProps }: WithRest<{ selection: LightningPaymentsResource, title?: string, open?: boolean, id: string, href?: string }, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()


	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningPaymentView from '$/views/LightningPaymentView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningPayment} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText="Loading payments…">
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
						items={payments.values}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No payments listed yet.</p>{/snippet}
						{#snippet Item({ item })}
							<LightningPaymentView selection={select(EntityType.LightningPayment, item.entitySelector)} layout={EntityLayout.Summary} />
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
