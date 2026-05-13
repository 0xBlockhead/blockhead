<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
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
			entityId: EntityId<typeof schema, EntityType.EvmBlob>
			href: string
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

	const blob = useEntity(
		EntityType.EvmBlob,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
			versionedHash: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlob}
	{entityId}
	title={`Blob ${String(entityId.blobIndex)}`}
	{href}
	idDragPlainText={stringify(entityId)}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-row="inline align-center gap-2 wrap">
			<span
				data-badge="small"
				data-text="font-monospace"
			>
				#{String(entityId.blobIndex)}
			</span>
			<ResourceBoundary
				resource={blob}
				placeholderText="Loading blob…"
			>
				{#snippet children(b)}
					<small>
						<TruncatedValue
							value={b.versionedHash}
							format={TruncatedValueFormat.Abbr}
						/>
					</small>
				{/snippet}
			</ResourceBoundary>
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={blob}
			placeholderText="Loading blob…"
		>
			{#snippet children(b)}
				<dl>
					<div>
						<dt>Chain id</dt>
						<dd>{String(entityId.$network.chainId)}</dd>
					</div>
					{#if b.versionedHash !== undefined}
						<div>
							<dt>Versioned hash</dt>
							<dd>
								<TruncatedValue
									value={b.versionedHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.EvmBlob}
			{entityId}
		>
			<dl>
				<div>
					<dt>Blob index</dt>
					<dd>
						<NumberValue value={entityId.blobIndex} />
					</dd>
				</div>
				<div>
					<dt>Transaction</dt>
					<dd>
						<a
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
								{
									networkId: String(entityId.$network.chainId),
									transactionId: entityId.txHash,
								},
							)}
						>
							<TruncatedValue
								value={entityId.txHash}
								format={TruncatedValueFormat.Abbr}
							/>
						</a>
					</dd>
				</div>
			</dl>

		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
