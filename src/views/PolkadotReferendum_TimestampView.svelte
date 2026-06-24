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
			label: 'referendum',
		},
		{
			label: 'observation time',
		},
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'referendum',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'block number/hash',
				},
				'status',
				{
					label: 'decided/confirmation/enactment blocks',
				},
			],
			[
				{
					label: 'aye/nay votes',
				},
				'support',
				'approval',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Referendum',
				items: [
					{
						label: 'parent Polkadot referendum',
					},
				],
			},
			{
				label: 'Lifecycle',
				items: [
					'status',
					{
						label: 'decision/confirmation/enactment coordinates',
					},
				],
			},
			{
				label: 'Tally',
				items: [
					{
						label: 'aye/nay/support/approval fields',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'runtime storage payload',
					},
					{
						label: 'Subscan governance payload',
					},
					{
						label: 'block context',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotReferendum_Timestamp>
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
	entityType={EntityType.PolkadotReferendum_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
