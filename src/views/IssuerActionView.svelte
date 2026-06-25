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
		'actionKind',
		'$assetInstance',
		'targetSelector',
	],
	content: {
		dl: [
			[
				'actionKind',
				'$assetInstance',
				'targetSelector',
				'amount',
				'$issuerPower',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					{
						label: 'affected asset instance',
					},
				],
			},
			{
				label: 'Issuer power',
				items: [
					{
						label: 'authority row linked to this action',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'transaction',
					},
					{
						label: 'event/log',
					},
					{
						label: 'instruction',
					},
					{
						label: 'or mirror-node action payload when modeled',
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
			selection: EntityProxyResource<typeof schema, EntityType.IssuerAction>
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
	entityType={EntityType.IssuerAction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
