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
				label: 'type',
			},
			'result',
			{
				label: 'consensus timestamp',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'type',
					},
					'result',
					{
						label: 'consensus timestamp',
					},
					{
						label: 'transaction id',
					},
					'nonce',
					{
						label: 'payer',
					},
					{
						label: 'node account',
					},
					{
						label: 'fee',
					},
					{
						label: 'scheduled flag',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'HBAR transfers',
					items: [
						{
							label: 'HBAR transfer effects',
						},
					],
				},
				{
					label: 'Token transfers',
					items: [
						{
							label: 'HTS token/NFT transfer effects',
						},
					],
				},
				{
					label: 'Contract result/actions/logs',
					items: [
						{
							label: 'contract execution result',
						},
						{
							label: 'actions',
						},
						{
							label: 'logs',
						},
					],
				},
				{
					label: 'Schedule',
					items: [
						{
							label: 'linked schedule when present',
						},
					],
				},
				{
					label: 'Child/duplicate records',
					items: [
						{
							label: 'child',
						},
						{
							label: 'duplicate transaction list',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw transaction record',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTransaction>
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
	entityType={EntityType.HederaTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
