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
				label: 'deal id',
			},
			{
				label: 'provider miner',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'deal id',
					},
					{
						label: 'provider miner',
					},
					{
						label: 'client actor',
					},
					{
						label: 'piece CID',
					},
					{
						label: 'piece size',
					},
				],
				[
					{
						label: 'verified-deal flag',
					},
					'label',
					{
						label: 'start/end epochs',
					},
					{
						label: 'price per epoch',
					},
					{
						label: 'provider/client collateral',
					},
					{
						label: 'latest state',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Provider',
					items: [
						{
							label: 'provider Filecoin miner',
						},
					],
				},
				{
					label: 'Client',
					items: [
						{
							label: 'client Filecoin actor',
						},
					],
				},
				{
					label: 'State observations',
					items: [
						{
							label: 'timestamped deal lifecycle observations',
						},
					],
				},
				{
					label: 'Piece/proposal',
					items: [
						{
							label: 'piece CID',
						},
						'label',
						{
							label: 'size',
						},
						{
							label: 'price',
						},
						{
							label: 'collateral fields',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Filecoin network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'market-state methods',
						},
						{
							label: 'indexer deal payloads',
						},
						{
							label: 'sector deal ids when only partial',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinDeal>
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
	entityType={EntityType.FilecoinDeal}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
