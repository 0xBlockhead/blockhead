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
			label: 'target key',
		},
		{
			label: 'right key',
		},
		{
			label: 'observation time',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'target key',
				},
				{
					label: 'right key',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'source kind',
				},
				{
					label: 'collection',
				},
				{
					label: 'token',
				},
			],
			[
				{
					label: 'receiver selector',
				},
				{
					label: 'basis points',
				},
				{
					label: 'calculation kind',
				},
				{
					label: 'sale-price denomination policy',
				},
				{
					label: 'enforcement kind',
				},
				{
					label: 'ledger coordinate',
				},
				{
					label: 'contract address',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Collection/token',
				items: [
					{
						label: 'NFT collection or token',
					},
				],
			},
			{
				label: 'Receiver',
				items: [
					{
						label: 'account/EVM account when resolved',
					},
				],
			},
			{
				label: 'Format support',
				items: [
					{
						label: 'asset format support observation for ERC-2981/interface evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'royaltyInfo call',
					},
					{
						label: 'marketplace claim',
					},
					{
						label: 'metadata claim',
					},
					{
						label: 'or registry payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.RoyaltyRight_Timestamp>
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
	entityType={EntityType.RoyaltyRight_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
