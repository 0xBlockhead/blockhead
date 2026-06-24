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
			label: 'network',
		},
		{
			label: 'public key',
		},
		{
			label: 'latest observed alias/color/capacity/channel count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'public key',
				},
				{
					label: 'latest observed alias/color/capacity/channel count',
				},
				{
					label: 'latest location/address summary',
				},
				{
					label: 'channel count',
				},
				{
					label: 'local-node-state count when connected',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Channels',
				items: [
					{
						label: 'public channels connected to this node',
					},
				],
			},
			{
				label: 'Public observations',
				items: [
					{
						label: 'timestamped graph/node observations',
					},
				],
			},
			{
				label: 'Location',
				items: [
					{
						label: 'country/city',
					},
					{
						label: 'source labels',
					},
				],
			},
			{
				label: 'Addresses',
				items: [
					{
						label: 'advertised network addresses from timestamp observations',
					},
				],
			},
			{
				label: 'Local node state',
				items: [
					{
						label: 'BlockheadLightningNodeState when connected locally',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Lightning network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'public graph',
					},
					{
						label: 'LND node payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNode>
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
	entityType={EntityType.LightningNode}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
