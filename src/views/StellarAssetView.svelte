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
			'assetKey',
		],
		content: {
			dl: [
				[
					'assetKey',
					'assetKind',
					'assetCode',
					'issuer',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'claimable balances',
					when: 'open',
					items: [
						'$$claimableBalances',
					],
				},
				{
					label: 'liquidity pools',
					when: 'open',
					items: [
						'$$liquidityPools',
					],
				},
				{
					label: 'trustlines',
					when: 'open',
					items: [
						'$$trustlines',
					],
				},
				{
					label: 'offers',
					when: 'open',
					items: [
						'$$offers',
					],
				},
				{
					label: 'trades',
					when: 'open',
					items: [
						'$$trades',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAsset>
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
	entityType={EntityType.StellarAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
