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
		'$channel',
		'$account',
		'$network',
	],
	content: {
		dl: [
			[
				'$channel',
				'$account',
				'$network',
				{
					label: 'latest available/locked balance',
				},
				{
					label: 'latest observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Channel',
				items: [
					{
						label: 'parent local state channel',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'participant EVM account on the selected network',
					},
				],
			},
			{
				label: 'Collateral observations',
				items: [
					{
						label: 'timestamped available/locked balance rows',
					},
				],
			},
			{
				label: 'Settlement evidence',
				items: [
					{
						label: 'linked funding/withdrawal transactions when modeled',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadStateChannelDeposit>
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
	entityType={EntityType.BlockheadStateChannelDeposit}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
