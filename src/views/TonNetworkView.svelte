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
			label: 'linked base Network',
		},
		{
			label: 'masterchain workchain',
		},
		{
			label: 'latest network observation',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked base Network',
				},
				{
					label: 'masterchain workchain',
				},
				{
					label: 'latest masterchain seqno/shard/validator observation',
				},
				{
					label: 'bounded jetton/NFT/account windows',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network history',
				items: [
					{
						label: 'network status observations',
					},
				],
			},
			{
				label: 'Workchains/shards',
				items: [
					{
						label: 'workchain identities',
					},
					{
						label: 'shard/block observations',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'TON blocks by workchain/shard/seqno',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'observed accounts',
					},
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'contract classifications',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'message edges',
					},
				],
			},
			{
				label: 'Traces',
				items: [
					{
						label: 'source trace graphs',
					},
				],
			},
			{
				label: 'Jettons',
				items: [
					{
						label: 'jetton masters',
					},
				],
			},
			{
				label: 'NFTs',
				items: [
					{
						label: 'NFT collections and items',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNetwork>
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
	entityType={EntityType.TonNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
