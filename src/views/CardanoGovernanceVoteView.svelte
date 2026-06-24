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
			label: 'proposal',
		},
		{
			label: 'voter kind',
		},
		{
			label: 'voter credential',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'proposal',
				},
				{
					label: 'voter kind',
				},
				{
					label: 'voter credential',
				},
				'vote',
				'source',
				{
					label: 'DRep',
				},
				{
					label: 'stake pool',
				},
				{
					label: 'vote transaction',
				},
				{
					label: 'vote index',
				},
				'epoch',
				'slot',
				{
					label: 'anchor URL/hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Proposal',
				items: [
					{
						label: 'parent governance proposal',
					},
				],
			},
			{
				label: 'Voter',
				items: [
					{
						label: 'linked DRep or stake pool',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'vote-bearing Cardano transaction',
					},
				],
			},
			{
				label: 'Anchor',
				items: [
					{
						label: 'off-chain anchor evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'vote payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoGovernanceVote>
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
	entityType={EntityType.CardanoGovernanceVote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
