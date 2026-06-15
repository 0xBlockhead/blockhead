<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'


	// State
	let {
		entityFieldReference,
		title = 'Receipt logs',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.EvmLog
			>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmLog}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is one <code>LOG</code> opcode captured on the parent transaction receipt—emitter address, topics, and data payload.
		</p>
		<p>
			Topic 0 often fingerprints an ABI log declaration; additional topics carry indexed arguments when the emitter used ABI-style indexing.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No receipt logs on this transaction.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmLog}
				getKey={(line) => stringify(line.value[EntityMetaKey.Selector])}
				getSortValue={(line) => line.value[EntityMetaKey.Selector].logIndex}
				placeholderText="Loading receipt logs…"
				resource={derive(
					subscribe(
						entityFieldReference.entityType,
						entityFieldReference.selector,
						{
							fields: {
								[entityFieldReference.fieldName]: {
									sources: [
										Source.Blockscout_Rest,
										Source.Voltaire_JsonRpc,
									],
								},
							},
						},
					),
					(parent) => (
						[...(parent.fields.$$logs?.values ?? [])]
							.map((value) => ({
								value,
							}))
					),
				)}
				{title}
				href={EntitiesListProps.href ?? ''}
				id={`${EntitiesListProps.id ?? 'receipt-logs'}:items`}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No receipt logs on this transaction.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const line = item.value}
					{@const logId = line[EntityMetaKey.Selector]}
					<EntityView
						entityType={EntityType.EvmLog}
						entitySelector={logId}
						layout={EntityLayout.Summary}
						collapsible={false}
						showTypeAnnotation={false}
					>
						{#snippet Value()}
							<span data-badge="small">
								#{logId.logIndex}
							</span>
						{/snippet}

						{#snippet Title()}
							<span data-row="wrap gap-2 align-baseline">
								<span data-row="inline align-center gap-2 wrap">
									<span>Receipt log </span>
									<span data-badge="small">
										#{logId.logIndex}
									</span>
								</span>
								{#if line.topics[0]?.startsWith('0x')}
									<EvmTopicView
										selector={{ hex: normalizeEvmTopicHex(line.topics[0]) }}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							</span>
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
