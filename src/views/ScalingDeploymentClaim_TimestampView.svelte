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
		'$claim',
		'timestampMs',
		'architectureKind',
	],
	content: {
		dl: [
			[
				'$claim',
				'timestampMs',
				'source',
				{
					label: 'source updated time',
				},
				'architectureKind',
			],
			[
				'stack',
				{
					label: 'protocol id/label/kind',
				},
				'proofSystemKind',
				'$settlementNetwork',
			],
			[
				{
					label: 'DA kind/network',
				},
				{
					label: 'config/spec URLs',
				},
				{
					label: 'public/sequencer RPCs',
				},
				{
					label: 'selector chips for batch inbox/output oracle/bridge/forced inclusion/verifier/challenge/genesis/roles',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Claim',
				items: [
					{
						label: 'parent source-scoped deployment claim',
					},
				],
			},
			{
				label: 'Architecture',
				items: [
					{
						label: 'protocol id/label/kind',
					},
					'stack',
					'proofSystemKind',
					{
						label: 'source-backed classification',
					},
				],
			},
			{
				label: 'Settlement',
				items: [
					'$settlementNetwork',
					{
						label: 'batch inbox',
					},
					{
						label: 'output oracle',
					},
					{
						label: 'bridge selectors',
					},
					{
						label: 'settlement contract refs via parent when resolved',
					},
				],
			},
			{
				label: 'Sequencing',
				items: [
					{
						label: 'public/sequencer RPCs',
					},
					{
						label: 'batcher/sequencer selectors',
					},
				],
			},
			{
				label: 'Data availability',
				items: [
					{
						label: 'EVM blob, Celestia blob, Avail submission, or 0G data-blob selectors only when concrete evidence rows are linked',
					},
				],
			},
			{
				label: 'Proofs & challenges',
				items: [
					{
						label: 'verifier/challenge/forced-inclusion selectors',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'source/project/config URLs',
					},
					{
						label: 'raw selector payloads',
					},
					{
						label: 'source freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.ScalingDeploymentClaim_Timestamp>
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
	entityType={EntityType.ScalingDeploymentClaim_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
