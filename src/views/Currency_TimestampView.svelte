<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { currencyByIso4217 } from '$/constants/Currency.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Currency_Timestamp>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const currencyTimestamp = useEntity(
		EntityType.Currency_Timestamp,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			marketCap: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.Currency_Timestamp}
	bind:open
	{entityId}
	href={
		href
		?? resolve(
			'/(assets)/(currencies)/currency/[iso4217]',
			{ iso4217: entityId.$currency.iso4217 },
		)
	}
	title={`${entityId.$currency.iso4217} · catalog snapshot`}
	{...entityViewRest}
>
	{#snippet Heading()}
		<span>
			{entityId.$currency.iso4217}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Catalog snapshot for ordering and display: <strong>FX turnover weight</strong> in USD (BIS-style daily share), not crypto market capitalization.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={currencyTimestamp}
			placeholderText="Loading snapshot…"
		>
			{#snippet children(currencyTimestamp)}
				<dl data-column-item="center">
					{#if currencyTimestamp.marketCap !== undefined}
						<div>
							<dt>
								FX turnover weight (USD)
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Static catalog weight proportional to typical daily FX turnover — used to sort currencies, not live M2 or coin market cap.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="FX turnover weight"
									>ⓘ</abbr>
								</Tooltip>
							</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									value={currencyTimestamp.marketCap}
								/>
							</dd>
						</div>
					{/if}
					<div>
						<dt>Currency</dt>
						<dd>{currencyByIso4217[entityId.$currency.iso4217].name}</dd>
					</div>
					<div>
						<dt>Snapshot wall time</dt>
						<dd>
							<Timestamp
								timestamp={entityId.timestampMs}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Currency_Timestamp}
			{entityId}
		/>

		<section data-scroll-marker-label="Currency">
			<CurrencyView
				entityId={entityId.$currency}
				href={resolve(
					'/(assets)/(currencies)/currency/[iso4217]',
					{ iso4217: entityId.$currency.iso4217 },
				)}
				id={`${stringify(entityId)}:currency`}
				open={false}
			/>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
