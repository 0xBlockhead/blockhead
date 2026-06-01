<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LightningHtlc>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const htlc = useEntity(
		EntityType.LightningHtlc,
		entityId,
		{
			$: [
				Source.LightningLnd_Rest,
			],
			direction: {},
			amountMsat: {},
			expiryHeight: {},
			hashLock: {},
			state: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningHtlc}
	{entityId}
	title={`HTLC #${entityId.htlcIndex}`}
	idDragPlainText={String(entityId.htlcIndex)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{entityId.htlcIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>HTLC </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={htlc}
			placeholderText="Loading HTLC…"
		>
			{#snippet children(row)}
				<dl>
					{#if lightningHtlc.direction != null}
						<div>
							<dt>Direction</dt>
							<dd>{lightningHtlc.direction}</dd>
						</div>
					{/if}

					{#if lightningHtlc.amountMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{lightningHtlc.amountMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningHtlc.expiryHeight != null}
						<div>
							<dt>Expiry height</dt>
							<dd>{lightningHtlc.expiryHeight.toString()}</dd>
						</div>
					{/if}

					{#if lightningHtlc.state != null}
						<div>
							<dt>State</dt>
							<dd>{lightningHtlc.state}</dd>
						</div>
					{/if}

					{#if lightningHtlc.hashLock != null}
						<div>
							<dt>Hash lock</dt>
							<dd>
								<TruncatedValue
									value={lightningHtlc.hashLock}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
