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
		'transactionId',
		{
			label: 'owner',
		},
		'dataSizeBytes',
	],
	content: {
		dl: [
			[
				'transactionId',
				'ownerAddress',
				'targetAddress',
				{
					label: 'quantity',
				},
				{
					label: 'reward',
				},
				'format',
				'denomination',
			],
			[
				'$block',
				'dataSizeBytes',
				'dataRoot',
				'lastTx',
				'tags',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Resource',
				items: [
					{
						label: 'gateway resource for the data payload',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'containing block when confirmed',
					},
				],
			},
			{
				label: 'Tags',
				items: [
					{
						label: 'name/value tag list',
					},
				],
			},
			{
				label: 'Economics',
				items: [
					{
						label: 'quantity/reward/denomination',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'transaction endpoint',
					},
					{
						label: 'status/confirmation endpoint',
					},
					{
						label: 'gateway data availability',
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
			selection: EntityProxyResource<typeof schema, EntityType.ArweaveTransaction>
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
	entityType={EntityType.ArweaveTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
