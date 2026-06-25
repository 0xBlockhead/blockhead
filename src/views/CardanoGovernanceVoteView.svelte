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
		'$proposal',
		'voterKind',
		'voterCredential',
	],
	content: {
		dl: [
			[
				'$proposal',
				'voterKind',
				'voterCredential',
				'vote',
				'source',
			],
			[
				'$drep',
				'$stakePool',
				{
					label: 'vote transaction',
				},
				'voteIndex',
				'epoch',
			],
			[
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
