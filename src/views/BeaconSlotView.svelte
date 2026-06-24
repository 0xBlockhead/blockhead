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
			label: 'slot number',
		},
		'epoch',
		{
			label: 'block root',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'slot number',
				},
				'epoch',
				{
					label: 'proposer index',
				},
				{
					label: 'canonical flag',
				},
			],
			[
				{
					label: 'block root',
				},
				{
					label: 'parent root',
				},
				{
					label: 'state root',
				},
				{
					label: 'body root',
				},
				'signature',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Committees',
				items: [
					{
						label: 'committee assignments for this slot',
					},
				],
			},
			{
				label: 'Attestations',
				items: [
					{
						label: 'attestations included in this slot',
					},
				],
			},
			{
				label: 'Withdrawals',
				items: [
					{
						label: 'withdrawals included in this slot',
					},
				],
			},
			{
				label: 'Slashings',
				items: [
					{
						label: 'attester/proposer slashings included in this slot',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network consensus context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: '/eth/v1/beacon/headers/{block_id}',
					},
					{
						label: '/eth/v2/beacon/blocks/{block_id}',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSlot>
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
	entityType={EntityType.BeaconSlot}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
