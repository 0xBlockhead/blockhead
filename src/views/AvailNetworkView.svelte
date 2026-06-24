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
			label: 'linked Network',
		},
		{
			label: 'latest block',
		},
		{
			label: 'latest app/submission counts',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked Network',
				},
				{
					label: 'latest block number/hash',
				},
				{
					label: 'latest health/finality',
				},
				{
					label: 'app id count',
				},
				{
					label: 'data submission count',
				},
				{
					label: 'source coverage',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest status',
				items: [
					{
						label: 'latest head/finality/indexer observation',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'Avail block rows',
					},
				],
			},
			{
				label: 'App ids',
				items: [
					{
						label: 'DA app id rows',
					},
				],
			},
			{
				label: 'Data submissions',
				items: [
					{
						label: 'DA data submission rows',
					},
				],
			},
			{
				label: 'Scaling usage',
				items: [
					{
						label: 'scaling deployment claims whose DA network/selector points at Avail',
					},
				],
			},
			{
				label: 'Substrate base',
				items: [
					{
						label: 'Substrate/Polkadot rows when runtime/account rows are sourced',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvailNetwork>
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
	entityType={EntityType.AvailNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
