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
				label: 'timestamp',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'timestamp',
					},
					'source',
					{
						label: 'block number/hash',
					},
					'nonce',
					{
						label: 'free/reserved/frozen balances',
					},
					{
						label: 'legacy misc/fee frozen fields',
					},
					{
						label: 'provider/consumer/sufficient refcounts',
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
							label: 'parent Polkadot account',
						},
					],
				},
				{
					label: 'Block',
					items: [
						{
							label: 'Polkadot block when block coordinates are present',
						},
					],
				},
				{
					label: 'Balance breakdown',
					items: [
						{
							label: 'account data fields',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw RPC/indexer coordinates',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAccount_Timestamp>
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
	entityType={EntityType.PolkadotAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
