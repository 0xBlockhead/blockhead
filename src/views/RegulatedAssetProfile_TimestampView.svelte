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
			label: 'regulated asset profile',
		},
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'regulated asset profile',
				},
				'timestampMs',
				'source',
				'ledgerCoordinateKind',
				'$identityRegistry',
				'$compliance',
			],
			[
				'$trustedIssuersRegistry',
				'$claimTopicsRegistry',
				'paused',
				'registryVersion',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile',
				items: [
					{
						label: 'parent regulated asset profile',
					},
				],
			},
			{
				label: 'Registries',
				items: [
					{
						label: 'linked EVM contracts when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'contract calls/events',
					},
					{
						label: 'verified ABI interpretation',
					},
					{
						label: 'token-extension state',
					},
					{
						label: 'indexer payload freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.RegulatedAssetProfile_Timestamp>
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
	entityType={EntityType.RegulatedAssetProfile_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
