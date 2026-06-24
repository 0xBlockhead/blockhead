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
			label: 'policy id',
		},
		{
			label: 'asset name',
		},
		'fingerprint',
	],
	content: {
		dl: [
			[
				{
					label: 'policy id',
				},
				{
					label: 'asset name',
				},
				'fingerprint',
				{
					label: 'latest supply/holder snapshot',
				},
				{
					label: 'metadata summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Snapshots',
				items: [
					{
						label: 'timestamped native-asset supply/metadata observations',
					},
				],
			},
			{
				label: 'UTXOs',
				items: [
					{
						label: 'transaction outputs containing the asset',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'CIP-25/CIP-68/source metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNativeAsset>
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
	entityType={EntityType.CardanoNativeAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
