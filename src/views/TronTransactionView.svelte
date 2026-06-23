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
				label: 'transaction id',
			},
			{
				label: 'block ref/height',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'transaction id',
					},
					{
						label: 'block ref/height',
					},
					{
						label: 'timestamp',
					},
					{
						label: 'expiration',
					},
					{
						label: 'contract type',
					},
					'result',
					{
						label: 'fee',
					},
					{
						label: 'owner',
					},
					{
						label: 'recipient',
					},
					{
						label: 'contract',
					},
					{
						label: 'amount',
					},
					{
						label: 'asset name',
					},
					{
						label: 'raw data hash/hex summary',
					},
					{
						label: 'signature count',
					},
					{
						label: 'receipt status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Receipt',
					items: [
						{
							label: 'execution receipt/resource row',
						},
					],
				},
				{
					label: 'Token transfers',
					items: [
						{
							label: 'indexed token transfer effects',
						},
					],
				},
				{
					label: 'Block',
					items: [
						{
							label: 'containing block',
						},
					],
				},
				{
					label: 'Owner',
					items: [
						{
							label: 'owner account',
						},
					],
				},
				{
					label: 'Recipient',
					items: [
						{
							label: 'recipient account',
						},
					],
				},
				{
					label: 'Contract',
					items: [
						{
							label: 'called or created contract',
						},
					],
				},
				{
					label: 'Raw/signatures',
					items: [
						'rawDataHex',
						'signatures',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronTransaction>
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
	entityType={EntityType.TronTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
