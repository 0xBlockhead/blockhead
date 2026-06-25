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
		'$account',
		'$token',
		'level',
	],
	content: {
		dl: [
			[
				'$account',
				'$token',
				'level',
				'source',
				'balance',
			],
			[
				'contractAddress',
				'tokenId',
				'firstLevel',
				'lastLevel',
				'transferCount',
			],
			[
				'timestampMs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent Tezos account',
					},
				],
			},
			{
				label: 'Token',
				items: [
					{
						label: 'parent Tezos token',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'token transfers for account/token',
					},
				],
			},
			{
				label: 'Ledger key',
				items: [
					{
						label: 'big-map key when the balance maps to a ledger key',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'token-balance payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosTokenBalance_Timestamp>
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
	entityType={EntityType.TezosTokenBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
