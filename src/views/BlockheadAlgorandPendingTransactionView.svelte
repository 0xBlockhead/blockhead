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
				label: 'node id',
			},
			{
				label: 'tx id',
			},
			{
				label: 'observed time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'node id',
					},
					{
						label: 'tx id',
					},
					{
						label: 'observed time',
					},
					{
						label: 'network',
					},
					'sender',
					{
						label: 'transaction type',
					},
					'fee',
					{
						label: 'validity round range',
					},
					{
						label: 'group id',
					},
					{
						label: 'pool priority',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Payload',
					items: [
						{
							label: 'pending transaction JSON/msgpack summary',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'linked Algorand network',
						},
					],
				},
				{
					label: 'Group',
					items: [
						{
							label: 'sibling pending transactions with the same group id',
						},
					],
				},
				{
					label: 'Confirmation',
					items: [
						{
							label: 'confirmed Algorand transaction when the tx id resolves on-chain',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAlgorandPendingTransaction>
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
	entityType={EntityType.BlockheadAlgorandPendingTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
