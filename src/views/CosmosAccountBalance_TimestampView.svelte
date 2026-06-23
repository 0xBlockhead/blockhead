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
				label: 'account',
			},
			'denom',
			{
				label: 'observed amount',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					'denom',
					{
						label: 'observed amount',
					},
					{
						label: 'spendable amount when sourced',
					},
					'source',
					{
						label: 'observation time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'parent Cosmos account',
						},
					],
				},
				{
					label: 'Denom metadata',
					items: [
						{
							label: 'linked CosmosDenom when resolved',
						},
					],
				},
				{
					label: 'History',
					items: [
						{
							label: 'same account/denom snapshots',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'bank balance payload',
						},
						{
							label: 'pagination context',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosAccountBalance_Timestamp>
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
	entityType={EntityType.CosmosAccountBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
