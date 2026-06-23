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
				label: 'transfer id',
			},
			'source',
			{
				label: 'token',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transfer id',
					},
					'source',
					{
						label: 'token',
					},
					{
						label: 'from account',
					},
					{
						label: 'to account',
					},
					{
						label: 'operation',
					},
					'level',
					{
						label: 'timestamp',
					},
					{
						label: 'contract address',
					},
					{
						label: 'token id',
					},
					'amount',
					'standard',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Token',
					items: [
						{
							label: 'parent Tezos token',
						},
					],
				},
				{
					label: 'From/To',
					items: [
						{
							label: 'source and destination Tezos accounts',
						},
					],
				},
				{
					label: 'Operation',
					items: [
						{
							label: 'parent Tezos operation',
						},
					],
				},
				{
					label: 'Ledger effects',
					items: [
						{
							label: 'related token balance observations when available',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'transfer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosTokenTransfer>
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
	entityType={EntityType.TezosTokenTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
