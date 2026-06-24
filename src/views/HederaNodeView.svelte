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
		{
			label: 'node id',
		},
		{
			label: 'latest node account',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'node id',
				},
				{
					label: 'latest node account',
				},
				{
					label: 'latest endpoint count',
				},
				{
					label: 'latest stake',
				},
				{
					label: 'rewarded/not-rewarded stake',
				},
				{
					label: 'min/max stake',
				},
				{
					label: 'deleted flag',
				},
				{
					label: 'timestamp count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest node/address-book observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped node/address-book observations',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'node Hedera account from latest state',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hedera network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'registered-node/address-book payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNode>
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
	entityType={EntityType.HederaNode}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
