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
			label: 'account',
		},
		{
			label: 'jetton',
		},
		{
			label: 'observation time',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'account',
				},
				{
					label: 'jetton',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'jetton wallet address',
				},
				{
					label: 'balance',
				},
				{
					label: 'owner address',
				},
				{
					label: 'master address',
				},
				{
					label: 'last transaction lt',
				},
				{
					label: 'locked flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'holder account identity',
					},
				],
			},
			{
				label: 'Jetton',
				items: [
					{
						label: 'jetton master identity',
					},
				],
			},
			{
				label: 'Jetton wallet',
				items: [
					{
						label: 'wallet contract account when resolved',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'decoded transfers for account and jetton',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'balance/get-wallet-data payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonJettonBalance_Timestamp>
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
	entityType={EntityType.TonJettonBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
