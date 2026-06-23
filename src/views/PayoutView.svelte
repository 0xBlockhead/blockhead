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
			'source',
			{
				label: 'payout id',
			},
			{
				label: 'network',
			},
		],
		content: {
			dl: [
				[
					'source',
					{
						label: 'payout id',
					},
					{
						label: 'network',
					},
					{
						label: 'asset instance/class',
					},
					{
						label: 'distributor contract',
					},
					{
						label: 'snapshot coordinate',
					},
					{
						label: 'merkle root',
					},
					{
						label: 'payment asset',
					},
					{
						label: 'total amount',
					},
					{
						label: 'recipient count',
					},
					{
						label: 'opened/closed times',
					},
					{
						label: 'latest claim count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Claims',
					items: [
						{
							label: 'account-scoped claim observations grouped by status',
						},
					],
				},
				{
					label: 'Asset',
					items: [
						{
							label: 'asset instance or asset class',
						},
					],
				},
				{
					label: 'Distributor',
					items: [
						{
							label: 'distributor EVM contract',
						},
						{
							label: 'source event/call evidence',
						},
					],
				},
				{
					label: 'Snapshot',
					items: [
						{
							label: 'block/round/record coordinate',
						},
						{
							label: 'merkle root',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Lens tokenDistribution',
						},
						{
							label: 'distributor contract',
						},
						{
							label: 'indexer',
						},
						{
							label: 'or analytics payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.Payout>
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
	entityType={EntityType.Payout}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
