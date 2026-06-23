<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'network',
			},
			'epoch',
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'epoch',
					'source',
					'slot',
					{
						label: 'constitution anchor URL/hash',
					},
					{
						label: 'guardrail script hash',
					},
					{
						label: 'previous anchor URL/hash',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent Cardano network',
						},
					],
				},
				{
					label: 'Governance',
					items: [
						{
							label: 'governance proposals for constitution updates',
						},
					],
				},
				{
					label: 'Anchor',
					items: [
						{
							label: 'off-chain constitution document evidence',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'constitution/local-state-query/indexer payload',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.CardanoConstitution_Epoch>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.CardanoConstitution_Epoch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
