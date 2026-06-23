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
				label: 'transaction',
			},
			'round',
			{
				label: 'hash type',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					'round',
					{
						label: 'hash type',
					},
					'source',
					{
						label: 'proof byte availability',
					},
					{
						label: 'state-proof hash',
					},
					{
						label: 'tree depth',
					},
					{
						label: 'path summary',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent transaction',
						},
					],
				},
				{
					label: 'Round',
					items: [
						{
							label: 'ledger round coordinate',
						},
					],
				},
				{
					label: 'Proof material',
					items: [
						{
							label: 'proof bytes/path/hash fields',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'algod transaction proof payload',
						},
						{
							label: 'node freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTransactionProof>
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
	entityType={EntityType.AlgorandTransactionProof}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
