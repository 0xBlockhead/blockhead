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
				label: 'source transaction hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'source transaction hash',
					},
				],
				[
					{
						label: 'origin EVM network',
					},
					{
						label: 'origin EVM transaction',
					},
					{
						label: 'recorded timestamp',
					},
					{
						label: 'initiator network account when expanded',
					},
					{
						label: 'linked bridge transfer when resolved',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Origin transaction',
					items: [
						{
							label: 'source EVM transaction',
						},
					],
				},
				{
					label: 'Initiator',
					items: [
						{
							label: 'initiator EVM network account',
						},
					],
				},
				{
					label: 'Sourceable transfer',
					items: [
						{
							label: 'bridge transfer when a status/indexer resolver proves the lifecycle',
						},
					],
				},
				{
					label: 'Local record',
					items: [
						{
							label: 'recorded-at timestamp',
						},
						{
							label: 'product-local context',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBridgeTransaction>
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
	entityType={EntityType.BlockheadBridgeTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
