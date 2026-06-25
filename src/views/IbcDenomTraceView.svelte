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
		'$network',
		'traceKey',
		'displayDenom',
	],
	content: {
		dl: [
			[
				'$network',
				'traceKey',
				'displayDenom',
				'denomHash',
				'baseDenom',
			],
			[
				'path',
				{
					label: 'source port/channel',
				},
				{
					label: 'local denom',
				},
				'$assetInstance',
				'$channel',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Channel',
				items: [
					{
						label: 'linked IBC transfer channel',
					},
				],
			},
			{
				label: 'Local denom',
				items: [
					{
						label: 'linked CosmosDenom for the local hashed denom when resolved',
					},
				],
			},
			{
				label: 'Base asset',
				items: [
					{
						label: 'asset instance when registry/catalog mapping resolves',
					},
				],
			},
			{
				label: 'Path',
				items: [
					{
						label: 'hop list parsed from transfer path',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'denom trace',
					},
					{
						label: 'asset registry payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.IbcDenomTrace>
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
	entityType={EntityType.IbcDenomTrace}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
